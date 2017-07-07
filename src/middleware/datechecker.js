'use strict';

var CurrentChallenge = require('../models/current_challenge').CurrentChallenge;

// changes the state of currentChallenge if end date have passed
//  -> if all steps completed - completed
//  -> if steps missing - failed
var checkIfEndDatePassed = function (req, res, next) {
    var inputDate = new Date().toISOString();
    CurrentChallenge.find({
        'state' : 'active',
        createdAt : { $lte : inputDate}

    }, {_id: 1, state: 1, stepsCompleted: 1}).exec(function (err, currentChallenges) {
        if (err) return next(err);
        if(currentChallenges) {
            console.log(currentChallenges);

            currentChallenges.forEach(function (currentChallenge) {
                if(currentChallenge.stepsCompleted.length === 3) {
                    currentChallenge.state = 'completed';
                } else {
                    currentChallenge.state = 'failed';
                }
                currentChallenge.save(function (err) {
                    if (err) return next(err);
                    console.log('State changed for ' + currentChallenge._id);
                }); // end save
            }); // end forEach
            next();
        } else {
            console.log('No currentChallenge found with date passed.');
            next();
        }
    }); // end find
};

module.exports.checkIfEndDatePassed = checkIfEndDatePassed;