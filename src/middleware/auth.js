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
        return next(false);
    }
    else {
        return next(true);

    }
}


module.exports.isAuthenticated = isAuthenticated;