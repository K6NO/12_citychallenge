'use strict';
// load all the things we need
const
    LocalStrategy   = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook'),
    User = require('../models/user').User;

// Access credentials
const secret = require('./secret.json');

function generateOrFindUser(accessToken, refreshToken, profile, done) {
    console.log('accessToken: ' + accessToken + ' refreshToken: ' + refreshToken);
    console.log(profile.emails[0]);
    if(profile.emails[0]) {
        User.findOneAndUpdate({
                emailAddress: profile.emails[0].value
            }, {
                fullName: profile.displayName,
                userName: profile.username,
                emailAddress: profile.emails[0].value,
                photoUrl: profile.photos[0].value,
                city: profile.hometown
            }, {
                upsert: true
            },
            done);
    } else {
        var noEmailError = new Error('Your email privacy settings prevent you from signing in. Please change privacy settings in your Facebook profile.');
        done(noEmailError, null);
    }
}

// expose this function to our app using module.exports
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        console.log('serialize');
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        console.log('deserialize');
        User.findById(user._id, function (err, user) {
            done(err, user)
        });
    });

    /*
     Bad Request was thrown by passport for missing access on username and password.
     It is checking body and URL query for fields username and password.
     If either is falsy the request is rejected with status 400.
     On creating your LocalStrategy you may pass set of options in additional argument to constructor
     choosing differently named fields using options usernameField and/or passwordField.
     */
    passport.use('local-login', new LocalStrategy(
        {usernameField:"emailAddress", passwordField:"password"},
        function(emailAddress, password, done) {
            User.findOne({
                emailAddress: emailAddress
            }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err) {
                    console.log('local-login general error');
                    return done(err);
                }
                // if no user is found, return the message
                if (!user) {
                    return done(null, false, {message:'User not found. Unable to login'});
                }
                // if the user is found but the password is wrong
                if (!user.validPassword(password)) {
                    return done(null, false, {message:'Password invalid. Unable to login'});
                }
                // all is well, return successful user
                return done(null, user);
            });
        }
    ));

    // Facebook authentication strategy
    //https://github.com/nax3t/angular-express-passport-tutorial/blob/master/facebook.md

    //passport.use('facebook', new FacebookStrategy({
    //    clientID: secret.facebookAppId,
    //    clientSecret: secret.facebookSecret,
    //    callbackURL: "http://localhost:3000/auth/facebook/return",
    //    profileFields: ['id', 'displayName', 'photos', 'email', 'hometown']
    //}), function () {
    //    console.log('yay');
    //
    //});
};