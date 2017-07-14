'use strict';
var mongoose = require('mongoose');

var db = mongoose.connection;
var CurrentChallenge = require('../models/current_challenge').CurrentChallenge;

/* HELPER FUNCTIONS */

// Used to calculate end date of challenge / this format is month/year-change proof
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

var saveAndCheckWaitListForMatch = function(req, res, next) {
    // save current challenge
    let newCurrentChallenge = new CurrentChallenge(req.body);
    newCurrentChallenge.save(function (err, currentChallenge) {
        if (err) return next(err);

        //add new currentChallenge to the waitlist;
        db.collection('waitlist').insert(currentChallenge);

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
                            console.log(startDate);
                            console.log(matchingCurrentChallenges[0].challenge);

                            CurrentChallenge.findOneAndUpdate(
                                {
                                    _id: matchingCurrentChallenges[0]._id
                                },
                                {
                                    $set: {
                                        state: 'active',
                                        partner: matchingCurrentChallenges[1].user,
                                        startedAt: startDate,
                                        endsAt: endDate
                                    }
                                },
                                { new: true},
                                function (err, firstChallenge) {
                                    if(err) return next(err);

                                    // Update second currentChallenge (mathcing one) - start, endTime, state, partner
                                    CurrentChallenge.findOneAndUpdate(
                                        {
                                            _id: matchingCurrentChallenges[1]._id
                                        },
                                        {
                                            $set: {
                                                state: 'active',
                                                partner: matchingCurrentChallenges[0].user,
                                                startedAt: startDate,
                                                endsAt: endDate
                                            }
                                        },
                                        {new: true},
                                        function (err, secondChallenge) {
                                            if(err) return next(err);

                                            // remove matching and new current challenges from waitlist
                                            db.collection('waitlist').deleteMany({
                                                "_id": { "$in" : [matchingChallenge._id, newCurrentChallenge._id]}
                                            });

                                            // return both documents in an array
                                            req.saved = true;
                                            req.currentChallenges = [firstChallenge, secondChallenge];
                                            next();
                                        }); // end second update
                                }); // end first update
                        }); // end find()
                } else {

                    // there was not metch, return the new currentChallenge
                    console.log('No matches found');
                    req.currentChallenge = newCurrentChallenge;
                    next();
                }
            }
        ); // end waitlist find

    }); // end save
};


module.exports.saveAndCheckWaitListForMatch = saveAndCheckWaitListForMatch;

