(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('ChallengesController',  function ($scope, $location, $filter, dataService) {

            // get all challenges
            dataService.getChallenges(function (response) {
                console.log(response.data);
                $scope.challenges = response.data;
            });

            $scope.pageIndicator = 'landing-page';

            // update challenge
            $scope.updateChallenge = function (challengeId, challenge) {
                dataService.updateChallenge(challengeId, challenge, function (challenge) {
                    console.log(challenge);
                    $scope.challenge = challenge;
                });
            };
        });
})();