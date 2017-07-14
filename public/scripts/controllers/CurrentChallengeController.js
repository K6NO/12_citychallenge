(function(){
    'use strict';
    let errorCallback = function (response) {
        $scope.errors = response.data.errors;
    };

    angular.module('cityChallengeApp')
        .controller('CurrentChallengeController',  function ($scope, $location, $filter, dataService) {

            let errorCallback = function (response) {
                $scope.errors = response.data.errors;
            };

            $scope.pageIdentifier = 'landing-page';

            let currentChallengeId = $location.path().split('/')[3];

            if(currentChallengeId != undefined){
                //get challenge
                dataService.getCurrentChallenge(currentChallengeId, function (response) {

                    // helper function to sort messages by date
                    function compare(a,b) {
                        if(a.createdAt < b.createdAt) return -1;
                        if(a.createdAt > b.createdAt) return 1;
                        return 0;
                    }

                    let userMessages = response.data.currentChallenge.messages;
                    let allMessages = [];
                    if(response.data.partnerMessages) {
                        console.log('true');
                        let partnerMessages = response.data.partnerMessages;
                        allMessages = userMessages.concat(partnerMessages);
                    } else {
                        console.log('false');
                        allMessages = userMessages;
                    }

                    allMessages.sort(compare);
                    console.log(allMessages);

                    $scope.currentChallenge = response.data.currentChallenge;
                    if(allMessages) {
                        $scope.messages = allMessages;
                    }

                    // bind checkboxes to steps
                    $scope.steps = response.data.currentChallenge.steps;

                }, errorCallback);
            }


            $scope.saveSteps = function () {
                console.log('save steps cChallenge controller');
                //let currentChallenge = {
                //    "steps": $scope.steps
                //};
                console.log($scope.steps);

                dataService.stepCompletedCurrentChallenge($scope.currentChallenge._id, $scope.steps, function (response) {
                    console.log('service returns this');

                    console.log(response.data);
                }, errorCallback)
            };

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

            $scope.sendMessage = function (newMessageText) {
                dataService.sendMessage($scope.currentChallenge._id, {"message" : newMessageText}, function (currentChallengeMessages) {
                    $scope.currentChallenge.messages = currentChallengeMessages.data;
                    $scope.newMessageText = '';
                    console.log(currentChallengeMessages)
                }, errorCallback)
            }
        });
})();