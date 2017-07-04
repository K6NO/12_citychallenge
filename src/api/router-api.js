'use strict';

var express = require('express');
var apiRouter = express.Router();

// Import models
var User = require('../models/user').User;
var Challenge = require('../models/challenge').Challenge;
var CurrentChallenge = require('../models/current_challenge').CurrentChallenge;


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
apiRouter.get('/challenges/:id', function(req, res) {
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

// GET current challenge
apiRouter.get('/challenges/current/:id', function(req, res) {
    let challengeId = req.params.id;
    res.json({ challenge: 'current challenge nr.: ' + challengeId });
});

// POST create a new current challenge
apiRouter.post('/challenges/current/', function(req, res) {
    let currentChallenge = req.body;
    // save into database

    res.json(req.body);
});

// PUT update a current challenge
apiRouter.put('/challenges/current/:id', function(req, res) {
    let currentChallenge = req.body;
    // upsert into database

    res.json({ currentChallenge });
});

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
