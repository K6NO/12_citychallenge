'use strict';
const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user').User;

/* FACEBOOK AUTH ROUTES */

// GET /auth/login/facebook
router.get('/login/facebook', passport.authenticate('facebook', {scope: ["email user_hometown"]}));

// GET /auth/facebook/return
router.get('/facebook/return', passport.authenticate('facebook',
    {succesRedirect: '/profile', successRedirect: '/#!/profile', failureRedirect: '/#!/login'}), function (req, res) {
    // success auth
    res.status(200).json(req.isAuthenticated() ? {status: true, user: req.session.passport.user} : {status: false});
});

/* GOOGLE AUTH ROUTES */

// GET /auth/login/google
router.get('/login/google', passport.authenticate('google', {scope: ['email', 'profile']}));

// GET /auth/google/return
router.get('/google/return', passport.authenticate('google',
    {succesRedirect: '/profile', successRedirect: '/#!/profile', failureRedirect: '/#!/login'}), function (req, res) {
    // success auth
    res.status(200).json(req.isAuthenticated() ? {status: true, user: req.session.passport.user} : {status: false});
});

/* LOGOUT */

// GET /auth/logout
router.get('/logout', function (req, res) {
    req.logout();
    res.sendStatus(200);
});

/* LOCAL AUTH */

router.get('/loggedin', function(req, res) {
    console.log('in loggedin');
    console.log(req.isAuthenticated());
    //console.log(req.session.passport.user);
    res.status(200).json(req.isAuthenticated() ? {status: true, user: req.session.passport.user} : {status: false});
});

// POST / login process the login form
router.post("/login", passport.authenticate('local-login'), function(req, res) {
    res.json(req.user);
});

// handle logout
router.post("/logout", function(req, res) {
    req.logOut();
    res.send(200);
});


router.post("/signup", function(req, res, next) {
    console.log(req.body.emailAddress);
    User.findOne({
        emailAddress: req.body.emailAddress
    }, function(err, user) {
        if (user) {
            console.log('Yay, identified user from email.');
            return res.json({message: 'This email is already registered to a profile'});
            } else {
            console.log('Yay, creating new user.');
            var newUser = new User();
            newUser.emailAddress = req.body.emailAddress.toLowerCase();
            newUser.fullName = req.body.fullName;
            newUser.userName = req.body.userName.toLowerCase();
            newUser.password = req.body.password;
            newUser.photoUrl = req.body.photoUrl;
            newUser.city = req.body.city;
            newUser.save(function(err, user) {
                req.login(user, function(err) {
                    if (err) {
                        return next(err);
                    }
                    console.log(user._id);
                    res.json(user);
                });
            });
        }
    });
});

module.exports = router;
