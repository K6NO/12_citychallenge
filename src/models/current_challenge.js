'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Message = require('./message');
const Step = require('./step');


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
    partnerChallenge: {
        type: Schema.Types.ObjectId,
        ref: "CurrentChallenge"
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
    steps: [
        { type: Schema.Types.ObjectId, ref: 'Step'}

        ],
    messages: [
        { type: Schema.Types.ObjectId, ref: 'Message'}
    ],
    remaining: {
        type: Schema.Types.Mixed
    }
});

// return remaining days/hours/minutes
CurrentChallengeSchema.methods.calculateRemainingTime = function () {
    let difference = this.endsAt - this.startedAt;
    console.log(difference);
    if (difference > 86400000) {
        this.remaining = [Math.floor(difference / 86400000), 'days'];
        console.log('days');
    } else if (difference > 3600000) {
        this.remaining = [Math.floor(difference / 3600000), 'hours'];
        console.log('hours');

    } else {
        this.remaining = [Math.floor(difference / 60000), 'minutes'];
        console.log('minutes');

    }
};

// model
var CurrentChallenge = mongoose.model("CurrentChallenge", CurrentChallengeSchema);

module.exports.CurrentChallenge = CurrentChallenge;