'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Message = require('./message');

var CurrentChallengeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    partner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    challenge : {
        type: Schema.Types.ObjectId,
        ref: "Challenge",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    startedAt: {
        type: Date
    },
    endsAt: {
        type: Date
    },
    state: {
        type: String,
        required: true,
        default: 'waiting' // waiting, active, completed, abandoned, failed
    },
    stepsCompleted: {
        type: [Number]
    },
    messages: [
        {message : { type: Schema.Types.ObjectId, ref: 'Message'}}
    ],
    remaining: {
        type: Schema.Types.Mixed
    }
});

// return remaining days/hours/minutes
CurrentChallengeSchema.methods.calculateRemainingTime = function () {
    let difference = this.endsAt - this.startedAt;
    if (difference >= 86400000) {
        this.remaining = [Math.floor(difference / 86400000), 'days'];
    } else if (difference >= 3600000) {
        this.remaining = [Math.floor(difference / 3600000), 'hours'];
    } else {
        this.remaining = [Math.floor(difference / 60000), 'minutes'];
    }
};

// model
var CurrentChallenge = mongoose.model("CurrentChallenge", CurrentChallengeSchema);

module.exports.CurrentChallenge = CurrentChallenge;