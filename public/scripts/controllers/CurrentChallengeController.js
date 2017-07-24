(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('CurrentChallengeController', ['$scope', '$location', '$route', '$filter', 'dataService', 'authService',
            function ($scope, $location, $route, $filter, dataService, authService) {

                $scope.pageIdentifier = 'landing-page';
                $scope.message = {};

                authService.getLoggedInUser(function (response) {
                    if (response.data.status === false) {
                        $location.path("/login");
                    } else {
                        $scope.user = response.data.user;
                    }
                }, function (error) {
                    $scope.errors = error.data.errors;
                });

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
                    }, function (error) {
                        $scope.errors = error.data;
                    });
                }


                $scope.saveSteps = function () {


                    dataService.stepCompletedCurrentChallenge($scope.currentChallenge._id, $scope.currentChallenge.steps, function (response) {
                        $route.reload();
                    }, function (error) {
                        $scope.errors = error.data;
                    })
                };

                $scope.abandonCurrentChallenge = function () {
                    let currentChallenge = {
                        "state" : 'abandoned'
                    };
                    dataService.abandonCurrentChallenge(currentChallengeId, currentChallenge, function (currentChallenge) {
                        $scope.currentChallenge = currentChallenge;
                        $location.path("/challenges");
                    }, function (error) {
                        $scope.errors = error.data;
                    })
                };

                $scope.sendMessage = function (newMessageText) {
                    dataService.sendMessage($scope.currentChallenge._id, {"message" : newMessageText}, function (currentChallengeMessages) {
                        $scope.currentChallenge.messages = currentChallengeMessages.data;
                        $scope.newMessageText = '';
                        $route.reload();
                    }, function (error) {
                        $scope.errors = error.data;
                    })
                }
            }]);
})();