'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChallengeSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Provide a title.'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Provide a description.'],
        trim: true
    },
    why: {
        type: String,
        required: [true, 'Provide info on why one should take this challenge.'],
        trim: true
    },
    science: {
        type: String,
        required: [true, 'Provide info on the scientific background of the challenge.'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'Which city does the challenge take place?.'],
        trim: true
    },
    karma: {
        type: Number,
        required: [true, 'How much karma does this challenge give?']
    },
    time: {
    type: Number,
        required: [true, 'How long is the challenge in days?.']
    },
    likes: {
        type: Number,
        default: 0
    },
    times_taken: {
        type: Number,
        default: 0
    },
    difficulty: {
        type: Number,
        default: 0
    },
    fun: {
        type: Number,
        default: 0
    },
    steps: [
        {
            stepNumber: Number,
            description: {
                type: String,
                required: [true, 'Describe the step'],
                trim: true
            },
            completed: {
                type: Boolean,
                default: false
            }
        }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// model
var Challenge = mongoose.model("Challenge", ChallengeSchema);

module.exports.Challenge = Challenge;