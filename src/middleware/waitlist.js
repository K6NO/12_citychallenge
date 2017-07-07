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

        // add new currentChallenge to waitlist
        db.collection('waitlist').insert(currentChallenge);
    }); // end save

    /* --- CALLBACK HELL --- */

    // check if there are matches in the waitlist (when new currentChallenge saved)
    // return matching currentChallenge where challenge is the same but the user is different
    db.collection('waitlist').findOne(
        // query object
        {
            $and: [
                {challenge : {$eq: newCurrentChallenge.challenge}},
                {user: {$ne: newCurrentChallenge.user}}
            ]
        },
        //callback
        function(err, matchingChallenge){
            if (err) return next(err);

            // not falsey (which includes `undefined` and `null and `""`, and `0`, and `NaN`, and [of course] `false`)
            if (matchingChallenge) {

                // We need to query on the CurrentChallenge collection (not waitlist)
                CurrentChallenge.find(
                    {
                        "_id" : { "$in" : [matchingChallenge._id, newCurrentChallenge._id]}
                    }
                    )
                    .populate('challenge', 'time')
                    .exec(function (err, matchingCurrentChallenges) {
                        if (err) return next(err);

                        // Update first currentChallenge - start, endTime, state, partner
                        let startDate = new Date();
                        let endDate = addDays(startDate, matchingCurrentChallenges[0].challenge.time);

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

                                // Update second currentChallenge - start, endTime, state, partner
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

                                        // remove matching and current challenges from waitlist
                                        db.collection('waitlist').deleteMany({
                                            "_id": { "$in" : [matchingChallenge._id, newCurrentChallenge._id]}
                                        });
                                        req.saved = true;
                                        req.currentChallenges = [firstChallenge, secondChallenge];
                                        res.setHeader('Location', '/');
                                        next();
                                    }); // end second update
                            }); // end first update
                    }); // end find()
            } else {
                console.log('No matches found');
                req.saved = true;
                next();
            }
        }
    ); // end waitlist find
}


module.exports.saveAndCheckWaitListForMatch = saveAndCheckWaitListForMatch;

