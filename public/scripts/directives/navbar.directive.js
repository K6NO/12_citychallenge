'use strict';
module.directive('navbar', {
    templateUrl: 'templates/navbar.template.html',
    restrict: 'A',
    controller: ['$scope', '$filter', function ($scope, $filter, authService) {
        $scope.isCollapsed = true;
        let user = authService.getLoggedInUser();
        $scope.user = user;
    }]
});