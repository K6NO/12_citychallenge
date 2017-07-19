(function() {

    'use strict';

    angular.module('cityChallengeApp')
        .service('dataService', function ($http) {

            // CHALLENGES

            //GET /challenges - Gets all of the challenges.
            this.getChallenges = function (successCallback) {
                $http.get('/api/challenges')
                    .then(successCallback)
            };

            //GET /challenge/:id - Gets a challenge.
            this.getChallenge = function (challengeId, successCallback) {
                $http.get('/api/challenges/' + challengeId)
                    .then(successCallback)
            };

            // POST /challenges/ create a new challenge
            this.addChallenge = function (challenge, successCallback, errorCallback) {
                $http.post('/api/challenges', challenge)
                    .then(successCallback, errorCallback)
            };

            // PUT update a challenge (likes, difficulty, fun, times_taken) - TODO: change challenge object on front-end side
            this.updateChallenge = function (challengeId, challenge, successCallback, errorCallback) {
                $http.put('/api/challenges/' + challengeId, challenge)
                    .then(successCallback, errorCallback)
            };

            /* CURRENT CHALLENGES */

            // GET a single currentChallenge
            this.getCurrentChallenge = function (currentChallengeId, successCallback, errorCallback) {
                $http.get('/api/current/challenges/' + currentChallengeId)
                    .then(successCallback, errorCallback)
            };

            // GET all currentChallenges for user
            // returns an array of currentChallenges objects
            this.getCurrentChallengesForUser = function (successCallback, errorCallback) {
                $http.get('/api/current/user/challenges/')
                    .then(successCallback, errorCallback)
            };

            // POST create a new current challenge AND check for matching challenge
            // returns currentChallenges = [firstChallenge, secondChallenge] IF matches were found OR just saved: true
            this.addCurrentChallenge = function (currentChallenge, successCallback, errorCallback) {
                $http.post('/api/current/challenges/', currentChallenge)
                    .then(successCallback, errorCallback)
            };

            // PUT update a current challenge - abandon
            // returns updated currentChallenge
            this.abandonCurrentChallenge = function (currentChallengeId, currentChallenge, successCallback, errorCallback) {
                $http.put('/api/current/challenges/' + currentChallengeId + '/abandon', currentChallenge)
                    .then(successCallback, errorCallback)
            };

            // PUT update a current challenge - step completed
            // returns updated currentChallenge
            this.stepCompletedCurrentChallenge = function (currentChallengeId, steps, successCallback, errorCallback) {
                $http.put('/api/current/challenges/' + currentChallengeId, steps)
                    .then(successCallback, errorCallback)
            };

            // USERS

            // GET /user
            this.getUser = function (id, successCallback) {
                $http.get('/api/users/' + id)
                    .then(successCallback)
            };

            // POST - create a single user
            this.addUser = function (user, successCallback, errorCallback) {
                $http.post('/api/users', user)
                    .then(successCallback, errorCallback)
            };

            // PUT - update a single user
            this.updateUser = function (id, user, successCallback, errorCallback) {
                $http.put('/api/users/' + id, user)
                    .then(successCallback, errorCallback)
            };

            // MESSAGES

            // GET messages for currentChallenge
            // returns an array of messages
            this.getMessages = function (currentChallengeId, successCallback) {
                $http.get('/api/current/challenges/' + currentChallengeId + '/messages')
                    .then(successCallback)
            };

            // POST new text for currentChallenge
            // returns an array of updated messages
            this.sendMessage = function (currentChallengeId, message, successCallback, errorCallback) {
                $http.post('/api/current/challenges/' + currentChallengeId + '/messages', message)
                    .then(successCallback, errorCallback)
            };

        });
})();