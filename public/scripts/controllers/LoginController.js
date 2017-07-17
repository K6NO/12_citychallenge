(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('LoginController',  function ($scope, $location, dataService, authService) {

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

            $scope.facebookLogin = function () {
                $scope.error = false;
                $scope.disabled = true;

                authService.facebookLogin()

            }
        });
})();