'use strict';

angular.module('navbar')
    .controller('NavbarController', ['$scope', 'authService',
        function ($scope, authService) {
            $scope.isCollapsed = true;
            authService.getLoggedInUser(function (response) {
                if (response.data.status === false) {
                    // redirect to login page
                    console.log('shiiiit');
                } else {
                    $scope.user = response.data.user;
                }
            }, function (error) {
                $scope.errors = error.data.errors;
            });
        }]);
