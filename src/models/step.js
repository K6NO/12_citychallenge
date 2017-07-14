'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StepSchema = new Schema({
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
    }
);

// model
var Step = mongoose.model("Step", StepSchema);

module.exports.Step = Step;