(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('LoginController',  function ($scope, $location, dataService, authService) {

            let errorCallback = function (response) {
                $scope.errors = response.data.errors;
            };

            $scope.pageIdentifier = 'signup-page';
            $scope.user = {};

            $scope.login = function () {
                $scope.error = false;
                $scope.disabled = true;

                authService.login($scope.user.emailAddress, $scope.user.password)
                    .then(function () {
                        $location.path('/profile');
                        $scope.disabled = false;
                        $scope.loginForm= {};
                    })
                    .catch(function () {
                        $scope.error = true;
                        $scope.errors = 'Invalid username or password';
                        $scope.disabled = false;
                        $scope.loginForm = {};
                    })
            }


            // get all challenges
            $scope.addUser = function (user) {
                if(user.fullName && user.userName && user.emailAddress && user.password) {
                    dataService.addUser(user, function (response) {
                        $scope.saved = response.data.saved;
                        $location.path('/profile/' + response.data._id);
                    }, errorCallback);
                } else {
                    $scope.errors = 'All fields required.';

                }

            }

        });
})();