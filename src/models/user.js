'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var validator = require('validator');

// TODO verify if list of current challenges is necessary
var UserSchema = new Schema({
    emailAddress: {
        type: String,
        unique: true,
        validate: {
            validator: function(v) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: 'The email you provided is not a valid.'
        },
        required: [true, 'Provide an email address.'],
        trim: true
    },
    fullName: {
        type: String,
        required: [true, 'Provide your full name.'],
        trim: true
    },
    userName: {
        type: String,
        required: [true, 'Provide a username.'],
        trim: true
    },
    photoUrl: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Provide a password.']
    },
    city: {
        type: String,
        trim: true
    },
    karma: {
        type: Number,
        default: 0
    },
    //challenges: [{
    //    type: Schema.Types.ObjectId,
    //    ref: 'CurrentChallenge'
    //}],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// TODO Hashing passwords with pre-save hook
//UserSchema.pre('save', function (next) {
//    var user = this;
//    bcrypt.hash(user.password, 10, function(err, hash) {
//        if (err) {
//            return next(err);
//        }
//        user.password = hash;
//        next();
//    });
//});

// Email unique-validator
UserSchema.plugin(uniqueValidator);

// model
var User = mongoose.model("User", UserSchema);

module.exports.User = User;