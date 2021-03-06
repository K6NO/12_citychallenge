'use strict';

const express = require('express'),
    apiRouter = express.Router(),
    mongoose = require('mongoose');

const db = mongoose.connection;


// Import models
const User = require('../models/user').User,
    Challenge = require('../models/challenge').Challenge,
    CurrentChallenge = require('../models/current_challenge').CurrentChallenge,
    Message = require('../models/message').Message;


// waitlist, checkdates middleware
const waitlist = require('../middleware/waitlist'),
    dateChecker = require('../middleware/datechecker'),
    sendEmail = require('../mailgun/messageFactory');


/* CHALLENGES */

// GET all challenges
apiRouter.get('/challenges/', function(req, res, next) {
    Challenge.find({})
        .select('_id title description time karma likes times_taken difficulty fun backgroundImage')
        .sort({time: 1})
        .exec(function (err, challenges) {
            if(err) return next(err);
            return res.status(200).json(challenges);
        });
});

// GET a single challenge
apiRouter.get('/challenges/:id', function(req, res, next) {
    // check if user is logged in
    if(req.session.passport) {
        let challengeId = req.params.id;
        let userId = req.session.passport.user._id;

        Challenge.findById(challengeId)
            .populate('steps')
            .exec(function (err, challenge) {
                if(err) return next(err);

                if(!challenge){
                    var noChallengeErr = new Error('Challenge not found');
                    noChallengeErr.status = 404;
                    return next(noChallengeErr);
                }

                // search matching currentChallenges from user - this is used to change buttons depending on
                // the user's previous actions (completed, failed, in progress, etc.)
                CurrentChallenge.find(
                    {
                        $and: [
                            {challenge : {$eq: challengeId}},
                            {user: {$eq: userId}}
                        ]
                    }, function (err, _currentChallenges) {

                        if(err) return next(err);

                        if(_currentChallenges) {

                            return res.status(200).json({
                                "challenge" : challenge,
                                "currentChallenges" : _currentChallenges
                            });
                        }
                        return res.status(200).json({
                            "challenge" : challenge
                        });
                    });
            });
    } else {
        // User is not logged in
        let userNotAuthError = new Error('Your are not logged in');
        userNotAuthError.status = 401;
        return next(userNotAuthError);
    }
});

// POST a new challenge
apiRouter.post('/challenges/', function(req, res, next) {
    let challenge = new Challenge(req.body);
    challenge.save(function (err) {
        if (err) return next(err);
        res.setHeader('Location', '/');
        res.status(200).json({saved: true});
    });
});

// PUT update a challenge (likes, difficulty, fun, times_taken)
apiRouter.put('/challenges/:id', function(req, res, next) {
    let challengeId = req.params.id;

    // second param is the update object
    Challenge.findByIdAndUpdate(challengeId, req.body, {new: true})
        .exec(function (err, challenge) {
            if (err) return next(err);
            if(!challenge){
                var noDataErr = new Error('Challenge not found');
                noDataErr.status = 404;
                return next(noDataErr);
            }
            return res.status(201).json(challenge);
        })
});

/* CURRENT CHALLENGES */

// GET a single currentChallenge
apiRouter.get('/current/challenges/:id', dateChecker.checkIfEndDatePassed, function(req, res, next) {
    // check if user is logged in
    if(req.session.passport) {
        let challengeId = req.params.id;
        CurrentChallenge.findById(challengeId)
            .populate('user partner challenge messages steps partnerChallenge')
            .exec(function (err, currentChallenge) {
                if(err) return next(err);
                if(!currentChallenge) {
                    let noDataError = new Error('Current challenge was not found');
                    noDataError.status = 404;
                    return next(noDataError);
                }
                currentChallenge.calculateRemainingTime();

                if(currentChallenge.partnerChallenge) {
                    CurrentChallenge.findById(currentChallenge.partnerChallenge)
                        .populate('messages')
                        .exec(function (err, partnerChallenge) {
                            if(err) return next(err);
                            res.status(200).json({currentChallenge: currentChallenge, partnerMessages: partnerChallenge.messages});
                        })
                } else {
                    res.status(200).json({currentChallenge: currentChallenge});
                }
            });
    } else {
        // User is not logged in
        let userNotAuthError = new Error('Your are not logged in');
        userNotAuthError.status = 401;
        return next(userNotAuthError);
    }
});

// GET all currentChallenges for user
apiRouter.get('/current/user/challenges/', function(req, res, next) {
    // check if user is logged in
    if(req.session.passport){
        let userId = req.session.passport.user._id;
        CurrentChallenge.find({'user' : userId})
            .sort('-createdAt')
            .populate('partner', '-password')
            .populate('challenge', 'title likes times_taken difficulty fun karma time')
            .exec(function (err, currentChallenges) {
                if(err) return next(err);
                res.status(200).json(currentChallenges)
            });
    } else {
        // User is not logged in
        let userNotAuthError = new Error('Your are not logged in.');
        userNotAuthError.status = 401;
        return next(userNotAuthError);
    }
});

// TODO check waitlist logic
// POST create a new current challenge AND check for matching challenge
apiRouter.post('/current/challenges/', waitlist.saveAndCheckWaitListForMatch, function(req, res, next) {
    // session (logged in user) is checked in middleware
    if(req.currentChallenge) {
        res.status(200).json({
            currentChallenge: req.currentChallenge
        });
    }  else {
        res.status(404).json({
            message: 'Could not save current challenge'
        })
    }
});


// PUT update a current challenge - abandon
apiRouter.put('/current/challenges/:id/abandon', function(req, res, next) {
    if(req.session.passport) {
        let currentChallengeId = req.params.id;
        CurrentChallenge.findByIdAndUpdate(currentChallengeId, req.body, {new: true})
            .populate('user challenge partner partnerChallenge')
            .populate('partnerChallenge.user')
            .exec(function (err, currentChallenge) {
                if (err) return next(err);
                if(!currentChallenge){
                    var noDataErr = new Error('CurrentChallenge not found');
                    noDataErr.status = 404;
                    return next(noDataErr);
                }
                // hacking partner and user object into currentChallenge (deep population didn't work)
                currentChallenge.partnerChallenge.user = currentChallenge.partner;
                currentChallenge.partnerChallenge.partner = currentChallenge.user;

                // send out emails to user and partner on the event
                sendEmail('partnerAbandoned', null, currentChallenge.partnerChallenge);
                sendEmail('userAbandoned', null, currentChallenge);

                return res.status(201).json(currentChallenge);
            })
    } else {
        // User is not logged in
        let userNotAuthError = new Error('Your are not logged in.');
        userNotAuthError.status = 401;
        return next(userNotAuthError);
    }
});

// PUT update a current challenge - step completed
apiRouter.put('/current/challenges/:id', function(req, res, next) {
    if(req.session.passport) {
        let currentChallengeId = req.params.id;
        CurrentChallenge.findById(currentChallengeId)
            .populate('steps')
            .exec(function (err, _currentChallenge) {
                if (err) return next(err);
                _currentChallenge.steps.forEach(function (step, index) {
                    if (step.stepNumber === req.body[index].stepNumber) {
                        step.completed = req.body[index].completed;
                        step.save(function (err) {
                            if (err) return next(err);
                        });
                    }
                });
                _currentChallenge.save(function (err, numAffected) {
                    if (err) return next(err);
                    return res.status(201).json(numAffected)
                });
            });
    } else {
        // User is not logged in
        let userNotAuthError = new Error('Your are not logged in.');
        userNotAuthError.status = 401;
        return next(userNotAuthError);
    }
});



/* MESSAGES */

// GET messages for currentChallenge
apiRouter.get('/current/challenges/:id/messages', function(req, res, next) {
    let currentChallengeId = req.params.id;
    CurrentChallenge.findById(currentChallengeId)
        .populate('messages', '_id text')
        .exec(function (err, currentChallenge) {
            if (err) return next(err);
            if(!currentChallenge){
                var noDataErr = new Error('CurrentChallenge not found');
                noDataErr.status = 404;
                return next(noDataErr);
            }
            return res.status(201).json(currentChallenge.messages);
        })
});


// POST new text for currentChallenge
apiRouter.post('/current/challenges/:id/messages', function(req, res, next) {
    if(req.session.passport) {

        let currentChallengeId = req.params.id;
        CurrentChallenge.findById(currentChallengeId)
            .exec(function (err, currentChallenge) {
                if (err) return next(err);
                if (!currentChallenge) {
                    var noDataErr = new Error('CurrentChallenge not found. Message not saved.');
                    noDataErr.status = 404;
                    return next(noDataErr);
                }

                let message = new Message(
                    {
                        "user": currentChallenge.user,
                        "currentChallenge": currentChallenge._id,
                        "text": req.body.message
                    });

                currentChallenge.messages.push(message);
                currentChallenge.save(function (err) {
                    if (err) return next(err);
                    message.save(function (err, _message) {
                        if (err) return next(err);
                        currentChallenge.populate('messages', function (err, _currentChallenge) {
                            return res.status(201).json(_currentChallenge.messages);
                        });

                    });
                });
            });
    } else {
        // User is not logged in
        let userNotAuthError = new Error('Your are not logged in.');
        userNotAuthError.status = 401;
        return next(userNotAuthError);
    }
});


/* USERS */

// GET a single user
apiRouter.get('/users', function(req, res, next) {
    if(req.session.passport) {
        let userId = req.session.passport.user._id;
        console.log('userId: ' + userId);
        User.findOne({_id: userId})
            .select('-password')
            .exec(function (err, user) {
                if (err) return next(err);
                return res.status(200).json(user);
            })
    } else {
        // User is not logged in
        let userNotAuthError = new Error('Your are not logged in.');
        userNotAuthError.status = 401;
        return next(userNotAuthError);
    }

});

// TODO - user update needs to be implemented on FE side
// PUT - update a single user
apiRouter.put('/users/:id', function(req, res, next) {
    if(req.session.passport) {
        let userId = req.session.passport.user._id;
        User.findByIdAndUpdate(userId, req.body, {new: true})
            .select('-password')
            .exec(function (err, user) {
                if (err) return next(err);
                if (!user) {
                    var noUserErr = new Error('User not found');
                    noUserErr.status = 404;
                    return next(noUserErr);
                }
                return res.status(201).json(user);
            })
    } else {
        // User is not logged in
        let userNotAuthError = new Error('Your are not logged in.');
        userNotAuthError.status = 401;
        return next(userNotAuthError);
    }
});

module.exports = apiRouter;
