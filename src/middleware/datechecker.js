'use strict';

const Challenge = require('../models/current_challenge').CurrentChallenge;
const CurrentChallenge = require('../models/current_challenge').CurrentChallenge;

const User = require('../models/user').User;

const sendEmail = require('../mailgun/messageFactory');


// changes the state of currentChallenge if end date have passed
//  -> if all steps completed - completed
//  -> if steps missing - failed
var checkIfEndDatePassed = function (req, res, next) {
    var inputDate = new Date().toISOString();
    CurrentChallenge.find({
        'state' : 'active',
        endsAt : { $lte : inputDate}

    })
        .populate('challenge')
        .populate('user')
        .populate('partner', '_id karma completed')
        .populate('steps')
        .populate('partnerChallenge')
        .exec(function (err, currentChallenges) {
        if (err) return next(err);
        if(currentChallenges) {
            currentChallenges.forEach(function (currentChallenge) {
                console.log(currentChallenge);

                // Update state of currentChallenge, karma and number of current challenges for user and partner
                if(currentChallenge.steps[0].completed && currentChallenge.steps[1].completed && currentChallenge.steps[2].completed) {
                    currentChallenge.state = 'completed';
                    let newUserKarma = currentChallenge.user.karma += currentChallenge.challenge.karma;
                    let newUserCompletedChallenges = currentChallenge.user.completed+=1; // completed: newUserCompletedChallenges
                    let newChallengeTimesTaken = currentChallenge.challenge.times_taken+=1;
                    User.findByIdAndUpdate(currentChallenge.user._id, {karma: newUserKarma, completed: newUserCompletedChallenges}, {new: true}, function (err, user) {
                        if(err) return next(err);
                        Challenge.findByIdAndUpdate(currentChallenge.challenge._id, {times_taken : newChallengeTimesTaken}, {new: true}, function (err, challenge) {
                            if(err) return next(err);

                        });
                    });
                } else {
                    currentChallenge.state = 'failed';
                }
                currentChallenge.save(function (err) {
                    if (err) return next(err);
                    console.log('State changed for ' + currentChallenge._id + ' to ' + currentChallenge.state);
                    // send message to user
                    if(currentChallenge.state === 'completed'){
                        sendEmail('challengeCompleted', null, currentChallenge);
                    } else if (currentChallenge.state === 'failed') {
                        sendEmail('challengeFailedMessage', null, currentChallenge)
                    }
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