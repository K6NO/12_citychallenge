'use strict';
const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user').User,
    sendEmail = require('../mailgun/messageFactory');

/* FACEBOOK AUTH ROUTES */

// GET /auth/login/facebook
router.get('/login/facebook', passport.authenticate('facebook', {scope: ["email user_hometown"]}));

// GET /auth/facebook/return
router.get('/facebook/return', passport.authenticate('facebook', {
    successRedirect: '/#!/profile',
    failureRedirect: '/#!/login'
    }), function (req, res) {
    // success auth
    res.status(200).json(req.isAuthenticated() ? {status: true, user: req.session.passport.user} : {status: false});
});

/* GOOGLE AUTH ROUTES */

// GET /auth/login/google
router.get('/login/google', passport.authenticate('google', {scope: ['email', 'profile']}));

// GET /auth/google/return
router.get('/google/return', passport.authenticate('google', {
    successRedirect: '/#!/profile',
    failureRedirect: '/#!/login'
    }), function (req, res) {
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
    //console.log('in loggedin');
    //console.log(req.isAuthenticated());
    res.status(200).json(req.isAuthenticated() ? {status: true, user: req.session.passport.user} : {status: false});
});

// POST / login process the login form
router.post("/login", passport.authenticate('local-login', {
    successRedirect: '/#!/profile'
    }), function(req, res) {
    res.json(req.user);
});

// handle logout
router.post("/logout", function(req, res) {
    req.logOut();
    res.send(200);
});


router.post("/signup", function(req, res, next) {
    User.findOne({
        emailAddress: req.body.emailAddress
    }, function(err, user) {
        if (user) {
            let err = new Error('This email is already registered to a profile');
            err.status = 500;
            return next(err);
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
                if(err) return next(err);

                // sending welcome email message
                console.log('sending email');
                sendEmail('signup', user, null);

                req.login(user, function(err) {
                    if (err) {
                        return next(err);
                    }
                    res.json(user);
                });
            });
        }
    });
});

module.exports = router;
