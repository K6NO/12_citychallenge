'use strict';
const mongoose = require('mongoose'),
    db = mongoose.connection,
    CurrentChallenge = require('../models/current_challenge').CurrentChallenge,
    Step = require('../models/step').Step,
    sendEmail = require('../mailgun/messageFactory');

/* HELPER FUNCTIONS */

// Used to calculate end date of challenge / this format is month/year-change proof
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

var saveAndCheckWaitListForMatch = function(req, res, next) {
    // save current challenge - create new steps
    let step1 = new Step({
        "description" : req.body.steps[0].description,
        "stepNumber" : req.body.steps[0].stepNumber
    });
    let step2 = new Step({
        "description" : req.body.steps[1].description,
        "stepNumber" : req.body.steps[1].stepNumber
    });
    let step3 = new Step({
        "description" : req.body.steps[2].description,
        "stepNumber" : req.body.steps[2].stepNumber
    });

    // create new currentChallenge
    let newCurrentChallenge = new CurrentChallenge({
        user : req.body.user,
        challenge : req.body.challenge,
        steps: [step1, step2, step3]
    });


    newCurrentChallenge.save(function (err, _currentChallenge) {
        if (err) return next(err);
        console.log('no error on save');

        step1.save(function (err, _step1) {
            if (err) return next(err);
            step2.save(function (err, _step2) {
                if (err) return next(err);
                step3.save(function (err, _step3) {
                    if (err) return next(err);
                    console.log('all steps saved');

                    //add new currentChallenge to the waitlist;
                    db.collection('waitlist').insert(_currentChallenge);

                    // check if the waitlist has a matching currentChallenge (same challenge, different user, waiting status)
                    db.collection('waitlist').findOne(
                        {
                            $and: [
                                {state: {$eq: 'waiting'}},
                                {challenge : {$eq: newCurrentChallenge.challenge}},
                                {user: {$ne: newCurrentChallenge.user}}

                            ]
                        },
                        //callback
                        function(err, matchingChallenge){
                            if (err) return next(err);

                            // if there is a match query the CurrentChallenge documents for both entries (not the waitlist)
                            if (matchingChallenge) {
                                CurrentChallenge.find(
                                    {
                                        "_id" : { "$in" : [matchingChallenge._id, newCurrentChallenge._id]}
                                    }
                                    )
                                    .populate('challenge user')
                                    .exec(function (err, matchingCurrentChallenges) {
                                        if (err) return next(err);

                                        // Update first currentChallenge - start, endTime, state, partner
                                        let startDate = new Date();
                                        let endDate = addDays(startDate, matchingCurrentChallenges[0].challenge.time);

                                        // TODO changes happen here
                                        CurrentChallenge.findOneAndUpdate(
                                            {
                                                _id: matchingCurrentChallenges[0]._id
                                            },
                                            {
                                                $set: {
                                                    state: 'active',
                                                    partner: matchingCurrentChallenges[1].user,
                                                    partnerChallenge: matchingCurrentChallenges[1]._id,
                                                    startedAt: startDate,
                                                    endsAt: endDate
                                                }
                                            },
                                            { new: true})
                                            .populate('user challenge partner partnerChallenge')
                                            .exec(function (err, firstChallenge) {
                                                if(err) return next(err);
                                                console.log('before first message');
                                                sendEmail('startCurrentChallenge', null, firstChallenge);

                                                // Update second currentChallenge - start, endTime, state, partner
                                                CurrentChallenge.findOneAndUpdate(
                                                    {
                                                        _id: matchingCurrentChallenges[1]._id
                                                    },
                                                    {
                                                        $set: {
                                                            state: 'active',
                                                            partner: matchingCurrentChallenges[0].user,
                                                            partnerChallenge: matchingCurrentChallenges[0]._id,
                                                            startedAt: startDate,
                                                            endsAt: endDate
                                                        }
                                                    },
                                                    {new: true})
                                                    .populate('user challenge partner partnerChallenge')
                                                    .exec(function (err, secondChallenge) {
                                                        if(err) return next(err);

                                                        console.log('before second message');

                                                        sendEmail('startCurrentChallenge', null, secondChallenge);

                                                        // remove matching and new current challenges from waitlist
                                                        db.collection('waitlist').deleteMany({
                                                            "_id": { "$in" : [matchingChallenge._id, newCurrentChallenge._id]}
                                                        });

                                                        // return both documents in an array
                                                        req.saved = true;
                                                        req.currentChallenge = secondChallenge;
                                                        next();
                                                    }); // end second update)
                                            }); // end first update)
                                    }); // end find()
                            } else {
                                // there was not match, return the new currentChallenge
                                console.log('No matches found');
                                req.currentChallenge = newCurrentChallenge;
                                next();
                            }
                        }
                    ); // end waitlist find

                })
            })
        }); // end save step1

    }); // end save
};

module.exports.saveAndCheckWaitListForMatch = saveAndCheckWaitListForMatch;

