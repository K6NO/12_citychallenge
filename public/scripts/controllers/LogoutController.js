(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('LogoutController',  function ($scope, $location, dataService, authService) {

            let errorCallback = function (response) {
                $scope.errors = response.data.errors;
            };

            $scope.pageIdentifier = 'signup-page';
            $scope.user = {};

            $scope.logout = function () {

                authService.logout()
                    .then(function () {
                        $location.path('/challenges');
                    })
                    .catch(function () {
                        $scope.errors = 'Cannot logout';
                    })
            }
        });
})();