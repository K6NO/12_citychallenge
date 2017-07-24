'use strict';
const
    LocalStrategy   = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    User = require('../models/user').User;

// Access credentials
let facebookClientId = process.env.FACEBOOK_CLIENT_ID || require('./secret.json').FACEBOOK_CLIENT_ID;
let facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET || require('./secret.json').FACEBOOK_CLIENT_SECRET;
let googleClientId = process.env.GOOGLE_CLIENT_ID || require('./secret.json').GOOGLE_CLIENT_ID;
let googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || require('./secret.json').GOOGLE_CLIENT_SECRET;

let URI = process.env.HEROKU_URI || 'http://localhost:3000/';


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
        clientID: facebookClientId, // process.env.FACEBOOK_CLIENT_ID,
        clientSecret: facebookClientSecret, // process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: URI + "auth/facebook/return",
        profileFields: ['id', 'displayName', 'first_name', 'picture.type(large)', 'email', 'hometown'],
        enableProof: true
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
                upsert: true,
                new: true,
                passRawResult: true
            }, done)
        } else {
            var noEmailError = new Error('Your email privacy settings on Facebook prevent you from signing in with your Facebook Account. You can visit your Facebook profile to change this or choose another sign in method.');
            done(noEmailError, null);
        }
    }));

    // Google authentication strategy

    passport.use('google', new GoogleStrategy({
        clientID: googleClientId, // process.env.GOOGLE_CLIENT_ID
        clientSecret: googleClientSecret, // process.env.GOOGLE_CLIENT_SECRET
        callbackURL: URI + "auth/google/return"

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

// custom callback with FB strategy does not return updated object
//function (noUserError, user, raw) {
//    if (noUserError) return done(noUserError, null);
//    if(raw.lastErrorObject.updatedExisting) {
//        done(user, null);
//    } else {
//        // new user
//        sendEmail('signup', user, null);
//        done(user, null);
//    }
//}