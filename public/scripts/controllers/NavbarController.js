    'use strict';

    angular.module('navbar')
        .controller('NavbarController',  function ($scope, authService) {
            $scope.isCollapsed = true;
            let user = authService.getLoggedInUser();
            $scope.user = user;

            // somehow need to get a user object


        });
