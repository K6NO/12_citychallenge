'use strict';

const Challenge = require('../models/current_challenge').CurrentChallenge;
const CurrentChallenge = require('../models/current_challenge').CurrentChallenge;

const User = require('../models/user').User;


// changes the state of currentChallenge if end date have passed
//  -> if all steps completed - completed
//  -> if steps missing - failed
var checkIfEndDatePassed = function (req, res, next) {
    var inputDate = new Date().toISOString();
    CurrentChallenge.find({
        'state' : 'active',
        endsAt : { $lte : inputDate}

    })
        .populate('challenge', '_id karma times_taken')
        .populate('user', '_id karma completed')
        .populate('partner', '_id karma completed')
        .exec(function (err, currentChallenges) {
        if (err) return next(err);
        if(currentChallenges) {
            currentChallenges.forEach(function (currentChallenge) {

                // TODO check if both currentChallenges evaluate here-  - if yes commented fields can be deleted
                // Update state of currentChallenge, karma and number of current challenges for user and partner
                if(currentChallenge.steps.length === 3) {
                    currentChallenge.state = 'completed';
                    let newUserKarma = currentChallenge.user.karma += currentChallenge.challenge.karma;
                    //let newPartnerKarma = currentChallenge.partner.karma += currentChallenge.challenge.karma;
                    let newUserCompletedChallenges = currentChallenge.user.completed+=1; // completed: newUserCompletedChallenges
                    //let newPartnerCompletedChallenges = currentChallenge.partner.completed+=1; // completed: newPartnerCompletedChallenges
                    let newChallengeTimesTaken = currentChallenge.challenge.times_taken+=1;
                    User.findByIdAndUpdate(currentChallenge.user._id, {karma: newUserKarma, completed: newUserCompletedChallenges}, {new: true}, function (err, user) {
                        if(err) return next(err);
                        Challenge.findByIdAndUpdate(currentChallenge.challenge._id, {times_taken : newChallengeTimesTaken}, {new: true}, function (err, challenge) {
                            if(err) return next(err);
                        });
                        //User.findByIdAndUpdate(currentChallenge.partner._id, {karma: newPartnerKarma, completed: newPartnerCompletedChallenges}, {new: true}, function (err, partner) {
                        //    if(err) return next(err);
                        //
                        //})
                    });
                } else {
                    currentChallenge.state = 'failed';
                }
                currentChallenge.save(function (err) {
                    if (err) return next(err);
                    console.log('State changed for ' + currentChallenge._id + ' to ' + currentChallenge.state);
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