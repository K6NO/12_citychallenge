(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('LogoutController', ['$scope', '$location', 'dataService', 'authService',
            function ($scope, $location, dataService, authService) {

                $scope.pageIdentifier = 'signup-page';
                $scope.user = {};

                $scope.logout = function () {

                    authService.logout()
                        .then(function () {
                            $location.path('/challenges');
                        })
                        .catch(function () {
                            $scope.errors = 'Could not log out. Bizarre...';
                        })
                }
            }]);
})();