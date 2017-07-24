(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('ChallengeController',  ['$scope', '$location', '$filter', 'dataService', 'authService', function ($scope, $location, $filter, dataService, authService) {

            $scope.pageIdentifier = 'landing-page';
            $scope.buttonFlag = '';

            let challengeId = $location.path().split('/')[2];
            let userId= undefined;
            console.log(challengeId);

            if(challengeId != undefined){
                //get challenge and matching currentChallenges
                dataService.getChallenge(challengeId, function (response) {

                    $scope.challenge = response.data.challenge;
                    // check status of matching currentChallenges

                    response.data.currentChallenges.some(function (currentChallenge) {
                        console.log('in some');
                        if(currentChallenge.state === 'active' || currentChallenge.state === 'waiting') {
                            $scope.currentChallengeId = currentChallenge._id;
                            $scope.buttonFlag = 'active';
                            console.log('active');

                            return;
                        } else if (currentChallenge.state === 'completed') {
                            $scope.currentChallengeId = currentChallenge._id;
                            $scope.buttonFlag = 'completed';
                            console.log('completed');
                            return;
                        } else {
                            $scope.currentChallengeId = currentChallenge._id;
                            $scope.buttonFlag = 'failed';
                            console.log('failed');
                            return;
                        }
                    });
                }, function (err) {
                    $scope.errors = err;
                });
            }
            // get user
            authService.getLoggedInUser(function (response) {
                if (response.data.status === false) {
                    // redirect to login page
                    console.log('shiiiit');
                } else {
                    $scope.user = response.data.user;
                    userId = response.data.user._id;
                }
            }, function (error) {
                $scope.errors = error.data.errors;
            });

            $scope.startCurrentChallenge = function () {
                let currentChallenge = {
                    "user" : userId,
                    "challenge" : challengeId,
                    "steps" : [
                        {
                            "description" : $scope.challenge.steps[0].description,
                            "stepNumber" : $scope.challenge.steps[0].stepNumber
                        },
                        {
                            "description" : $scope.challenge.steps[1].description,
                            "stepNumber" : $scope.challenge.steps[1].stepNumber
                        },
                        {
                            "description" : $scope.challenge.steps[2].description,
                            "stepNumber" : $scope.challenge.steps[2].stepNumber
                        }]
                };
                dataService.addCurrentChallenge(currentChallenge, function (response) {
                    console.log(response);
                    $scope.currentChallenge = response.data.currentChallenge;
                    $location.path("/challenges/current/" + response.data.currentChallenge._id);
                }, function (response) {
                    $scope.errors = response.data.errors;
                })
            };

        }]);
})();