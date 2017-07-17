// Express middleware
'use strict';
var User = require('../models/user').User;
var auth = require('basic-auth');
// => { name: 'something', pass: 'whatever' }

// Define a middleware function to be used for every secured routes
function isAuthenticated (req, res, next){
    var isUserAuth = auth(req);
    //console.log(req.getHeader('Authorization'));
    console.log(isUserAuth);
    if (!req.isAuthenticated()) {
        console.log('in if');
        return next(false);

    }
    //res.send(401);
    else {
        console.log('in else');
        return next(true);

    }
        //next();
}

// User authentication
// Parse Authorization header
//function isAuthenticated (req, res, next) {
//    var isUserAuth = auth(req);
//    console.log(isUserAuth);
//    if (isUserAuth) {
//        console.log(isUserAuth.name + ' ' + isUserAuth.pass);
//        User.authenticate(isUserAuth.name, isUserAuth.pass, function (err, user) {
//            if(err){
//                let authErr = new Error('Error when authenticating user.');
//                authErr.status = 401;
//                return next(authErr);
//            } else if (!user) {
//                let authErr = new Error('Invalid credentials.');
//                authErr.status = 401;
//                return next(authErr);
//            } else {
//                req.session.userId = user._id;
//            }
//            return next();
//        });
//    } else {
//        var err = new Error('You must be logged in to view this page.');
//        err.status = 401;
//        return next(err);
//    }
//}

module.exports.isAuthenticated = isAuthenticated;