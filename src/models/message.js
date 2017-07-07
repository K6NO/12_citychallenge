'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        currentChallenge: {
            type: Schema.Types.ObjectId,
            ref: "CurrentChallenge",
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        text: {
            type: String,
            required: true
        }
    }
);

// model
var Message = mongoose.model("Message", MessageSchema);

module.exports.Message = Message;