'use strict';

var CurrentChallenge = require('../models/current_challenge').CurrentChallenge;
var User = require('../models/user').User;


// changes the state of currentChallenge if end date have passed
//  -> if all steps completed - completed
//  -> if steps missing - failed
var checkIfEndDatePassed = function (req, res, next) {
    var inputDate = new Date().toISOString();
    CurrentChallenge.find({
        'state' : 'active',
        createdAt : { $lte : inputDate}

    }
    // , {_id: 1, state: 1, stepsCompleted: 1, challenge: 1, user: 1}
    )
        .populate('challenge', '_id karma')
        .populate('user', '_id karma completed')
        .populate('partner', '_id karma completed')
        .exec(function (err, currentChallenges) {
        if (err) return next(err);
        if(currentChallenges) {
            currentChallenges.forEach(function (currentChallenge) {
                if(currentChallenge.stepsCompleted.length === 3) {
                    currentChallenge.state = 'completed';
                    let newUserKarma = currentChallenge.user.karma += currentChallenge.challenge.karma;
                    let newPartnerKarma = currentChallenge.partner.karma += currentChallenge.challenge.karma;
                    let newUserCompletedChallenges = currentChallenge.user.completed+=1; // completed: newUserCompletedChallenges
                    let newPartnerCompletedChallenges = currentChallenge.partner.completed+=1; // completed: newPartnerCompletedChallenges


                    // Update karma for user and partner
                    User.findByIdAndUpdate(currentChallenge.user._id, {karma: newUserKarma, completed: newUserCompletedChallenges}, {new: true}, function (err, user) {
                        if(err) return next(err);
                        User.findByIdAndUpdate(currentChallenge.partner._id, {karma: newPartnerKarma, completed: newPartnerCompletedChallenges}, {new: true}, function (err, partner) {
                            if(err) return next(err);
                        })
                    });
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
            console.log('No currentChallenge found where the date has passed.');
            next();
        }
    }); // end find
};

module.exports.checkIfEndDatePassed = checkIfEndDatePassed;