(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('UserController',  function ($scope, $location, $filter, dataService) {

            $scope.pageIndicator = 'profile-page';

            let userId = $location.path().split('/')[2];

            if(userId != undefined){
                //get challenge
                dataService.getUser(userId, function (response) {
                    $scope.user = response.data;
                });

                dataService.getCurrentChallengesForUser(userId, function (response) {
                    $scope.currentChallenges = response.data;
                    console.log(response.data);
                }, function (response) {
                    $scope.errors = response.data.errors;
                })
            }

            // add user
            $scope.addNewUser = function () {
                dataService.addUser($scope.user, function (user) {
                    console.log(user);
                    $scope.user = user;
                    $location.path('/profile');
                }, function (response) {
                    $scope.errors = response.data.errors;
                });
            };


            // update user
            $scope.updateUserInfo = function () {
                dataService.updateUser(userId, $scope.user, function (user) {
                    console.log(user);
                    $scope.user = user;
                    $location.path('/profile');
                }, function (response) {
                    $scope.errors = response.data.errors;
                });
            };
        });
})();