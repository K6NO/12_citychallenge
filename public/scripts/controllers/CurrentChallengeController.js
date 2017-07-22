(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('CurrentChallengeController', ['$scope', '$location', '$route', '$filter', 'dataService', 'authService',
            function ($scope, $location, $route, $filter, dataService, authService) {

                let errorCallback = function (response) {
                    $scope.errors = response.data;
                };

                $scope.pageIdentifier = 'landing-page';
                $scope.message = {};

                let user = authService.getLoggedInUser();
                //$scope.user = user;
                console.log(user._id);

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
                        if(response.data.currentChallenge.user._id !== user._id){
                            // TODO create error page and show it to the user
                            $scope.errors = 'It is not your challenge, so you cannot see it.'
                        } else {
                            let userMessages = response.data.currentChallenge.messages;
                            let allMessages = [];
                            if(response.data.partnerMessages) {
                                let partnerMessages = response.data.partnerMessages;
                                allMessages = userMessages.concat(partnerMessages);
                                $scope.partnerMessages = response.data.partnerMessages;
                            } else {
                                allMessages = userMessages;
                            }

                            allMessages.sort(compare);

                            $scope.currentChallenge = response.data.currentChallenge;
                            if(allMessages) {
                                $scope.messages = allMessages;
                            }

                            // bind checkboxes to steps
                            //$scope.steps = response.data.currentChallenge.steps;
                        }


                    }, errorCallback);
                }


                $scope.saveSteps = function () {


                    dataService.stepCompletedCurrentChallenge($scope.currentChallenge._id, $scope.currentChallenge.steps, function (response) {
                        $route.reload();
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
                    console.log(newMessageText);
                    dataService.sendMessage($scope.currentChallenge._id, {"message" : newMessageText}, function (currentChallengeMessages) {
                        $scope.currentChallenge.messages = currentChallengeMessages.data;
                        $scope.newMessageText = '';
                        $route.reload();
                    }, errorCallback)
                }
            }]);
})();