'use strict';
// load all the things we need
const
    LocalStrategy   = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    User = require('../models/user').User;

// Access credentials
const secret = require('./secret.json');

//function generateOrFindUser(accessToken, refreshToken, profile, done) {

//    if(profile.emails[0]) {
//        User.findOneAndUpdate({
//                emailAddress: profile.emails[0].value
//            }, {
//                fullName: profile.displayName,
//                userName: profile.username,
//                emailAddress: profile.emails[0].value,
//                photoUrl: profile.photos[0].value,
//                city: profile.hometown
//            }, {
//                upsert: true
//            },
//            done);
//    } else {
//        var noEmailError = new Error('Your email privacy settings prevent you from signing in. Please change privacy settings in your Facebook profile.');
//        done(noEmailError, null);
//    }
//}

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
    passport.use('local-login', new LocalStrategy({
        usernameField:"emailAddress",
        passwordField:"password"
    },
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
                    console.log('local-login no user is found');

                    return done(null, false, {
                        message:'User not found. Unable to login'
                    });
                }
                // if the user is found but the password is wrong
                if (!user.validPassword(password)) {
                    console.log('local-login pwd not valid');

                    return done(null, false, {
                        message:'Password invalid. Unable to login'
                    });
                }
                // all is well, return successful user
                user.password = '';
                return done(null, user);
            });
        }
    ));

    // Facebook authentication strategy

    passport.use('facebook', new FacebookStrategy({
        clientID: secret.facebookAppId,
        clientSecret: secret.facebookSecret,
        callbackURL: "http://localhost:3000/auth/facebook/return",
        profileFields: ['id', 'displayName', 'first_name', 'picture.type(large)', 'email', 'hometown']
    }, function (accessToken, refreshToken, profile, done) {
        if (profile.emails[0]) {
            User.findOneAndUpdate({
                emailAddress: profile.emails[0].value
            }, {
                fullName: profile.displayName,
                userName: profile.name.givenName,
                emailAddress: profile.emails[0].value,
                photoUrl: profile.photos[0].value
            }, {
                upsert: true
            }, done)
        } else {
            var noEmailError = new Error('Your email privacy settings on Facebook prevent you from signing in with your Facebook Account. You can visit your Facebook profile to change this or choose another sign in method.');
            done(noEmailError, null);
        }
    }));

    // Google authentication strategy

    passport.use('google', new GoogleStrategy({
        clientID: secret.googleId,
        clientSecret: secret.googleSecret,
        callbackURL: "http://localhost:3000/auth/google/return"

        },
        function (accessToken, refreshToken, profile, done) {

            let largerImage = profile.photos[0].value.substring(0, profile.photos[0].value.length-2);
            largerImage += '200';

            if(profile.emails[0]){
                User.findOneAndUpdate({
                    emailAddress: profile.emails[0].value
                }, {
                    fullName: profile.displayName,
                    userName: profile.name.givenName,
                    emailAddress: profile.emails[0].value,
                    photoUrl : largerImage
                }, {
                    upsert: true
                }, done)
            } else {
                var noEmailError = new Error('Your email privacy settings on Google prevent you from signing in with your Google Account. You can visit your Facebook profile to change this or choose another sign in method.');
                done(noEmailError, null);
            }
        }))
};