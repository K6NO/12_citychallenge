'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
        type: Date,
    },
    endsAt: {
        type: Date,
    },
    state: {
        type: String,
        required: true,
        default: 'waiting' // waiting, active, completed, abandoned, failed
    },
    stepsCompleted: {
        type: [Number]
    }
}
);

// model
var CurrentChallenge = mongoose.model("CurrentChallenge", CurrentChallengeSchema);

module.exports.CurrentChallenge = CurrentChallenge;