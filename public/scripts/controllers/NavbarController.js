    'use strict';

    angular.module('navbar')
        .controller('NavbarController',  function ($scope, dataService) {
            $scope.isCollapsed = true;

            console.log($scope.isCollapsed);

            // somehow need to get a user object


        });
