(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('ChallengeController',  function ($scope, $location, $filter, dataService) {

            let challengeId = $location.path().split('/')[2];
            console.log(challengeId);

            if(challengeId != undefined){
                //get challenge
                dataService.getChallenge(challengeId, function (response) {
                    console.log(response.data);
                    $scope.challenge = response.data;
                });
            }


            // update challenge
            $scope.updateChallenge = function (challengeId, challenge) {
                dataService.updateChallenge(challengeId, challenge, function (challenge) {
                    console.log(challenge);
                    $scope.challenge = challenge;
                });
            };
        });
})();