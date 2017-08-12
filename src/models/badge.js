'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BadgeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Provide a name for the badge.'],
        trim: true
    },
    photoUrl: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Static method for auth middleware



// model
var Badge = mongoose.model("Badge", BadgeSchema);

module.exports.Badge = Badge;