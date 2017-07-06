'use strict';
var CurrentChallenge = require('../models/current_challenge').CurrentChallenge;


var waitList = [];

// Public functions

// adds a currentChallenge to the waitlist
function addToWaitlist (challenge) {

    // how to create ain DB and add it here?
    waitList.push(currentChallenge);
}

// removes and returns the deleted element
function removeFromWaitList (id) {
    let waitListIndex = waitList.indexOf(id);
    if (waitListIndex > -1) {
        return waitList.splice(waitListIndex, 1)[0];
    }
}

// Private functions

function findMatches() {

    let searchIndex = 0;
    let search = waitList[searchIndex]._id;
    for(i=1; i<waitList.length; i++) {
        if(search == waitList[i]._id) {
            let firstCurrentChallenge = removeFromWaitList(searchIndex);
            let secondCurrentChallenge = removeFromWaitList(i);
            return [firstCurrentChallenge, secondCurrentChallenge]
        } else {
            searchIndex++;
            search = waitList[searchIndex]
        }
    }

}

module.exports.addToWaitlist = addToWaitlist;
module.exports.removeFromWaitList = removeFromWaitList;
module.exports.findMatches = findMatches;
