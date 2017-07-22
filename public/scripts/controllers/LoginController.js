(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('LoginController', ['$scope', '$location', 'dataService', 'authService',
            function ($scope, $location, dataService, authService) {

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
                            if(error.status === 401) {
                                $scope.errors.push('Email already registered or wrong password.')
                                $scope.user.password = '';
                            } else {
                                $scope.errors.push(error.data);
                                $scope.user.password = '';
                            }
                        })
                };
            }]);
})();