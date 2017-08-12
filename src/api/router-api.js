'use strict';

const express = require('express'),
    apiRouter = express.Router(),
    mongoose = require('mongoose'),
    Promise = require('bluebird');

// Import models
const User = require('../models/user').User,
    Challenge = require('../models/challenge').Challenge,
    CurrentChallenge = require('../models/current_challenge').CurrentChallenge,
    Message = require('../models/message').Message;


// waitlist, checkdates middleware
const waitlist = require('../middleware/waitlist'),
    dateChecker = require('../middleware/datechecker'),
    sendEmail = require('../mailgun/messageFactory');

/* HELPER FUNCTIONS */

let userNotLoggedInError = function (next) {
    let err = new Error('Your are not logged in');
    err.status = 401;
    return next(err);
};

/* CHALLENGES */

// GET all challenges
apiRouter.get('/challenges/', function(req, res, next) {
    let challengesPromise = Challenge.find({})
        .select('_id title description time karma likes times_taken difficulty fun backgroundImage')
        .sort({time: 1})
        .exec();
    challengesPromise.then(function (challenges) {
        return res.status(200).json(challenges);
    }).catch((err) => {return next(err);});
});

// GET a single challenge (and modify action button - see comment below)
apiRouter.get('/challenges/:id', function(req, res, next) {
    // check if user is logged in
    if (!req.session.passport) {
        userNotLoggedInError(next);
    } else {
        let challengeId = req.params.id;
        let userId = req.session.passport.user._id;

        let challengePromise = Challenge.findById(challengeId)
            .populate('steps')
            .exec();

        // find currentChallenges for signed-in user to dynamically change the action button based on user's history with challenges (completed, failed, in progress
        let currentChallengesPromise = challengePromise
            .then(function (challenge) {
                return CurrentChallenge.find(
                    {
                        $and: [
                            {challenge: {$eq: challengeId}},
                            {user: {$eq: userId}}
                        ]
                    }).exec();
            });

        return Promise.join(challengePromise, currentChallengesPromise, (challenge, currentChallenges) => {
            if (currentChallenges) {
                return res.status(200).json({
                    "challenge": challenge,
                    "currentChallenges": currentChallenges
                });
            }
            return res.status(200).json({
                "challenge": challenge
            });
        }).catch((err) => {return next(err)});
    }
});

// POST a new challenge
apiRouter.post('/challenges/', function(req, res, next) {
    let challenge = new Challenge(req.body);
    challenge.save()
        .then((challenge) => {
            res.setHeader('Location', '/');
            res.status(200).json({saved: true, challenge: challenge});
        }).catch((err) =>{return next(err);});
});

// PUT update a challenge (likes, difficulty, fun, times_taken)
apiRouter.put('/challenges/:id', function(req, res, next) {
    let challengeId = req.params.id;

    // second param is the update object
    let challengePromise = Challenge.findByIdAndUpdate(challengeId, req.body, {new: true}).exec();
    challengePromise.then((challenge) => {
        return res.status(201).json(challenge);
    }).catch((err) => {return next(err);});
});

/* CURRENT CHALLENGES */

// GET a single currentChallenge
apiRouter.get('/current/challenges/:id', dateChecker.checkIfEndDatePassed, function(req, res, next) {
    // check if user is logged in
    if (!req.session.passport) {
        userNotLoggedInError(next);
    } else {
        let challengeId = req.params.id;

        let currentChallengePromise = CurrentChallenge.findById(challengeId)
            .populate('user partner challenge messages steps partnerChallenge')
            .exec();

        let partnerChallengePromise = currentChallengePromise.then((currentChallenge) => {
            if (currentChallenge.partnerChallenge) {
                return CurrentChallenge.findById(currentChallenge.partnerChallenge)
                    .populate('messages')
                    .exec();
            }
        });

        Promise.join(currentChallengePromise, partnerChallengePromise, (currentChallenge, partnerChallenge) => {
                if(partnerChallenge) {
                    currentChallenge.calculateRemainingTime();
                    return res.status(200).json({
                        currentChallenge: currentChallenge,
                        partnerMessages: partnerChallenge.messages
                    });
                } else {
                    currentChallenge.calculateRemainingTime();
                    return res.status(200).json({currentChallenge: currentChallenge});
                }
            }
        ).catch((err) => {return next(err)});
    }
});

// GET all currentChallenges for user
apiRouter.get('/current/user/challenges/', function(req, res, next) {
    if (!req.session.passport) {
        userNotLoggedInError(next);
    } else {
        let userId = req.session.passport.user._id;
        let currentChallengePromise = CurrentChallenge.find({'user': userId})
            .sort('-createdAt')
            .populate('partner', '-password')
            .populate('challenge', 'title likes times_taken difficulty fun karma time')
            .exec();
        currentChallengePromise.then((currentChallenges) => {
            return res.status(200).json(currentChallenges)
        }).catch((err) => {return next(err)});
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
    if (!req.session.passport) {
        userNotLoggedInError(next);
    } else {
        let currentChallengeId = req.params.id;
        let currentChallengePromise = CurrentChallenge.findByIdAndUpdate(currentChallengeId, req.body, {new: true})
            .populate('user challenge partner partnerChallenge')
            .populate('partnerChallenge.user')
            .exec();
        currentChallengePromise.then((currentChallenge) => {
            // hacking partner and user object into currentChallenge (deep population didn't work)
            currentChallenge.partnerChallenge.user = currentChallenge.partner;
            currentChallenge.partnerChallenge.partner = currentChallenge.user;

            // send emails to user and partner on the event
            sendEmail('partnerAbandoned', null, currentChallenge.partnerChallenge);
            sendEmail('userAbandoned', null, currentChallenge);
            return res.status(201).json(currentChallenge);
        }).catch((err) => {return next(err)});
    }
});

// PUT update a current challenge - step completed
apiRouter.put('/current/challenges/:id', function(req, res, next) {
    if (!req.session.passport) {
        userNotLoggedInError(next);
    } else {
        let currentChallengeId = req.params.id;
        let currentChallengePromise = CurrentChallenge.findById(currentChallengeId)
            .populate('steps')
            .exec();

        // TODO consider refactoring this based on: https://stackoverflow.com/questions/38362231/how-to-use-promise-in-foreach-loop-of-array-to-populate-an-object
        currentChallengePromise.then((currentChallenge) => {
            currentChallenge.steps.forEach(function (step, index) {
                if (step.stepNumber === req.body[index].stepNumber) {
                    step.completed = req.body[index].completed;
                    step.save(function (err) {
                        if (err) return next(err);
                    });
                }
            });
            return currentChallenge.save();
        }).then((_currentChallenge) => {
            return res.status(201).json(_currentChallenge);
        }).catch((err) => {return next(err)});
    }
});



/* MESSAGES */

// GET messages for currentChallenge
apiRouter.get('/current/challenges/:id/messages', function(req, res, next) {
    let currentChallengeId = req.params.id;
    let currentChallengePromise = CurrentChallenge.findById(currentChallengeId)
        .populate('messages', '_id text')
        .exec();
    currentChallengePromise.then((currentChallenge) => {
        return res.status(201).json(currentChallenge.messages);
    }).catch((err) => {return next(err);})
});


// POST new message for currentChallenge
apiRouter.post('/current/challenges/:id/messages', function(req, res, next) {
    if (!req.session.passport) {
        userNotLoggedInError(next);
    } else {
        let currentChallengeId = req.params.id;
        let currentChallengePromise = CurrentChallenge.findById(currentChallengeId)
            .exec();
        let message = new Message(
            {
                "user": req.session.passport.user._id,
                "currentChallenge": currentChallengeId,
                "text": req.body.message
            });
        let messagePromise = message.save();

        Promise.join(currentChallengePromise, messagePromise, (currentChallenge, message) => {
            console.log('in joined promises');
            currentChallenge.messages.push(message);
            return currentChallenge.save();
        }).then((currentChallenge) => {
            return currentChallenge.execPopulate('messages');
        }).then((_currentChallenge) => {
            return res.status(201).json(_currentChallenge.messages);
        }).catch((err)=> {
            console.log(err);
            return next(err)});
    }
});

/* USERS */

// GET a single user
apiRouter.get('/users', function(req, res, next) {
    if (!req.session.passport) {
        userNotLoggedInError(next);
    } else {
        let userId = req.session.passport.user._id;
        let userPromise = User.findOne({_id: userId})
            .select('-password')
            .exec();
        userPromise.then((user) => {
            return res.status(200).json(user);
        }).catch((err)=> {return next(err);});
    }
});

// TODO - user update needs to be implemented on FE side
// PUT - update a single user
apiRouter.put('/users/:id', function(req, res, next) {
    if (!req.session.passport) {
        userNotLoggedInError(next);
    } else {
        let userId = req.session.passport.user._id;
        let userPromise = User.findByIdAndUpdate(userId, req.body, {new: true})
            .select('-password')
            .exec();
        userPromise.then((user) => {
            user.calculateLevel();
            return res.status(201).json(user);
        }).catch((err) => {return next (err)});
    }
});

module.exports = apiRouter;
