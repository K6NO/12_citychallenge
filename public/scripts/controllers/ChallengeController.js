(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('ChallengeController',  function ($scope, $location, $filter, dataService) {

            $scope.pageIdentifier = 'landing-page';

            let challengeId = $location.path().split('/')[2];
            console.log(challengeId);

            if(challengeId != undefined){
                //get challenge
                dataService.getChallenge(challengeId, function (response) {
                    console.log(response.data);
                    $scope.challenge = response.data;
                });
            }

            let userId = '57029ed4795118be119cc111';
            if(userId != undefined){
                dataService.getUser(userId, function (response) {
                    $scope.user = response.data;
                })
            }

            $scope.startCurrentChallenge = function (userId, challengeId, steps) {
                let currentChallenge = {
                    "user" : userId,
                    "challenge" : challengeId,
                    "steps" : steps
                };
                dataService.addCurrentChallenge(currentChallenge, function (response) {
                    console.log(response);
                    $scope.currentChallenge = response.data.currentChallenge;
                    //console.log($scope.currentChallenge);
                    $location.path("/challenges/current/" + response.data.currentChallenge._id);
                }, function (response) {
                    $scope.errors = response.data.errors;
                })
            };

            // update challenge
            $scope.updateChallenge = function (challengeId, challenge) {
                dataService.updateChallenge(challengeId, challenge, function (challenge) {
                    console.log(challenge);
                    $scope.challenge = challenge;
                });
            };
        });
})();