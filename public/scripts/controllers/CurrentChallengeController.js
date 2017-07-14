(function(){
    'use strict';
    let errorCallback = function (response) {
        $scope.errors = response.data.errors;
    };

    angular.module('cityChallengeApp')
        .controller('CurrentChallengeController',  function ($scope, $location, $filter, dataService) {

            $scope.pageIdentifier = 'landing-page';

            let currentChallengeId = $location.path().split('/')[3];
            console.log(currentChallengeId);

            if(currentChallengeId != undefined){
                //get challenge
                dataService.getCurrentChallenge(currentChallengeId, function (response) {
                    $scope.currentChallenge = response.data;
                }, errorCallback);
            }


            //let userId = $scope.currentChallenge.user._id;
            //let challengeId = $scope.currentChallenge.challenge._id;

            $scope.abandonCurrentChallenge = function () {
                let currentChallenge = {
                    "state" : 'abandoned'
                };
                dataService.abandonCurrentChallenge(currentChallengeId, currentChallenge, function (currentChallenge) {
                    $scope.currentChallenge = currentChallenge;
                    console.log($scope.currentChallenge);
                    $location.path("/challenges");
                }, errorCallback)
            };

            $scope.updateStepsCurrentChallenge = function (stepId) {
                let currentChallenge = {
                    "steps" : [stepId]
                };
                dataService.stepCompletedCurrentChallenge(currentChallengeId, currentChallenge, function (currentChallenge) {
                    $scope.currentChallenge = currentChallenge;
                    console.log($scope.currentChallenge);
                }, errorCallback)
            };
        });
})();