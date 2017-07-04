'use strict';

var express = require('express');
var apiRouter = express.Router();

// Import models
var User = require('../models/user').User;
var Challenge = require('../models/challenge').Challenge;
var CurrentChallenge = require('../models/current_challenge').CurrentChallenge;


// GET all challenges
apiRouter.get('/challenges', function(req, res) {
    res.json({ challenges: 'challenges' });
});

// GET a single challenge
apiRouter.get('/challenges/:id', function(req, res) {
    let challengeId = req.params.id;
    res.json({ challenge: 'challenge nr.: ' + challengeId });
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
apiRouter.get('/users/:id', function(req, res) {
    let userId = req.params.id;
    res.json({ challenge: 'user nr.: ' + userId });
});

// POST - create a single user
apiRouter.post('/users', function(req, res) {
    let user = req.body;
    res.json({ challenge: 'new user: ' + user });
});

// PUT - update a single user
apiRouter.put('/users/:id', function(req, res) {
    let userId = req.params.id;
    let user = {}; // findByIdAndUpdate
    res.json({ challenge: 'new user: ' + user });
});

module.exports = apiRouter;
