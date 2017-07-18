(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('LoginController',  function ($scope, $location, dataService, authService) {

            $scope.pageIdentifier = 'signup-page';
            $scope.user = {};
            $scope.errors = [];

            $scope.removeError = function () {
                $scope.errors = [];
            };

            $scope.login = function () {
                //$scope.error = false;
                //$scope.disabled = true;

                authService.login($scope.user.emailAddress, $scope.user.password)
                    .then(function () {
                        $location.path('/profile');
                        //$scope.disabled = false;
                        //$scope.loginForm= {};
                    })
                    .catch(function (error) {
                        $scope.errors.push(error.data);

                        //$scope.error = true;
                        //$scope.disabled = false;
                        //$scope.loginForm = {};
                    })
            };
        });
})();