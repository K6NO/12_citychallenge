(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('UserController',  function ($scope, $location, $filter, dataService) {

            let userId = $location.path().split('/')[2];
            console.log(challengeId);

            if(userId != undefined){
                //get challenge
                dataService.getUser(userId, function (response) {
                    console.log(response.data);
                    $scope.user = response.data;
                });
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