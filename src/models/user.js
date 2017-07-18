'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
    completed: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
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

// Hashing passwords with pre-save hook
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

// Static method for auth middleware

// TODO elvileg ezzel is mukodik, ha beadom az emailAddresst
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({emailAddress: email})
        .exec(function (err, user) {
            if(err) {
                return callback(err);
            } else if (!user) {
                var noUserError = new Error('User not found.');
                noUserError.status = 404;
                return callback(noUserError);
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if(result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            })

        })
};

UserSchema.methods.calculateLevel = function () {
    this.level = Math.floor(this.karma / 100);
};

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
};

// Email unique-validator
UserSchema.plugin(uniqueValidator);

// model
var User = mongoose.model("User", UserSchema);

module.exports.User = User;