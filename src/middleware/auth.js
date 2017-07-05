// Express middleware
'use strict';
var User = require('../models/user').User;
var auth = require('basic-auth');
// => { name: 'something', pass: 'whatever' }

// User authentication
// Parse Authorization header
function isAuthenticated (req, res, next) {
    var isUserAuth = auth(req);
    if (isUserAuth) {
        console.log(isUserAuth.name + ' ' + isUserAuth.pass);
        User.authenticate(isUserAuth.name, isUserAuth.pass, function (err, user) {
            if(err){
                let authErr = new Error('Error when authenticating user.');
                authErr.status = 401;
                return next(authErr);
            } else if (!user) {
                let authErr = new Error('Invalid credentials.');
                authErr.status = 401;
                return next(authErr);
            } else {
                req.session.userId = user._id;
            }
            return next();
        });
    } else {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
}

module.exports.isAuthenticated = isAuthenticated;