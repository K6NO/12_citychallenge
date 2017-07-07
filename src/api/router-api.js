'use strict';

var express = require('express');
var apiRouter = express.Router();
var mongoose = require('mongoose');

var db = mongoose.connection;


// Import models
var User = require('../models/user').User;
var Challenge = require('../models/challenge').Challenge;
var CurrentChallenge = require('../models/current_challenge').CurrentChallenge;

// auth middleware
var auth = require('../middleware/auth'); //auth.isAuthenticated

var waitlist = require('../middleware/waitlist');


/* CHALLENGES */

// GET all challenges
apiRouter.get('/challenges', function(req, res, next) {
    Challenge.find({})
        .select('_id title description time karma likes times_taken difficulty fun')
        .sort({time: 1})
        .exec(function (err, challenges) {
            if(err) return next(err);
            return res.status(200).json(challenges);
        });
});

// GET a single challenge
apiRouter.get('/challenges/:id', function(req, res, next) {
    let challengeId = req.params.id;
    Challenge.findById(challengeId)
        .exec(function (err, challenge) {
            if(err) return next(err);
            if(!challenge){
                var noChallengeErr = new Error('Challenge not found');
                noChallengeErr.status = 404;
                return next(noChallengeErr);
            }
            return res.status(200).json(challenge);
        });
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

// PUT update a challenge (likes, difficulty, fun, times_taken) - TODO: change challenge object on front-end side
apiRouter.put('/challenges/:id', function(req, res, next) {
    let challengeId = req.params.id;

    // second param is the update object - should arrive in the updated form from the frontend
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

// GET currentChallenge
apiRouter.get('/current/challenges/:id', function(req, res, next) {
    let challengeId = req.params.id;

    CurrentChallenge.findById(challengeId)
        .populate('user', 'fullName username photoUrl city')
        .populate('partner', 'fullName username photoUrl city')
        .populate('challenge')
        .exec(function (err, currentChallenge) {
            if(err) return next(err);
            if(!currentChallenge) {
                let noDataError = new Error('Current challenge was not found');
                noDataError.status = 404;
                return next(noDataError);
            }
            res.status(200).json(currentChallenge);
        });
});

// GET all currentChallenges for user
apiRouter.get('/current/challenges/user/:id', function(req, res, next) {
    // TODO change to session.userId and change path (delete /user/)
    let userId = req.params.id;
    CurrentChallenge.find({'user' : userId})
        .populate('partner', '-password')
        .populate('challenge', 'title likes times_taken difficulty fun karma')
        .exec(function (err, currentChallenges) {
            if(err) return next(err);
            res.status(200).json(currentChallenges)
        });
});

// POST create a new current challenge
apiRouter.post('/current/challenges/', waitlist.saveAndCheckWaitListForMatch, function(req, res, next) {

    if(req.currentChallenges) {
        res.setHeader('Location', '/');
        res.status(200).json({
            saved: req.saved,
            currentChallenges: req.currentChallenges
        });
    } else {
        res.setHeader('Location', '/');
        res.status(200).json({
            saved: req.saved
        });
    }

});

// PUT update a current challenge
apiRouter.put('/current/challenges/:id', function(req, res, next) {
    let currentChallengeId = req.params.id;
    CurrentChallenge.findByIdAndUpdate(currentChallengeId, req.body, {new: true})
        .exec(function (err, currentChallenge) {
            if (err) return next(err);
            if(!currentChallenge){
                var noDataErr = new Error('CurrentChallenge not found');
                noDataErr.status = 404;
                return next(noDataErr);
            }
            return res.status(201).json(currentChallenge);
        })
});

/* USERS */

// GET a single user
apiRouter.get('/users/:id', function(req, res, next) {
    // TODO switch to req.session.userId, add mid.isAuthenticated middleware to params
    let userId = req.params.id;
    User.findOne({_id: userId})
        .select('-password')
        .exec(function (err, user) {
            if (err) return next(err);
            return res.status(200).json(user);
        })
});

// POST - create a single user
apiRouter.post('/users', function(req, res, next) {
    let user = new User(req.body);
    user.save(function (err) {
        if (err) return next(err);
        res.setHeader('Location', '/');
        res.status(200).json({saved: true});
    })
});

// PUT - update a single user
apiRouter.put('/users/:id', function(req, res, next) {
    let userId = req.params.id;
    //params: id, updateObj, {options}
    User.findByIdAndUpdate(userId, req.body, {new: true})
        .select('-password')
        .exec(function (err, user) {
            if (err) return next(err);
            if(!user){
                var noUserErr = new Error('User not found');
                noUserErr.status = 404;
                return next(noUserErr);
            }
            return res.status(201).json(user);
        })
});

module.exports = apiRouter;
