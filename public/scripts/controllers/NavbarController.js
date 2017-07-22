'use strict';

angular.module('navbar')
    .controller('NavbarController', ['$scope', 'authService',
        function ($scope, authService) {
            $scope.isCollapsed = true;
            let user = authService.getLoggedInUser();
            $scope.user = user;
        }]);
