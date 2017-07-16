(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('SignupController',  function ($scope, $location, $filter, dataService) {

            let errorCallback = function (response) {
                $scope.errors = response.data.errors;
            };

            $scope.pageIdentifier = 'signup-page';
            $scope.user = {};


            // get all challenges
            $scope.addUser = function (user) {
                if(user.fullName && user.userName && user.emailAddress && user.password) {
                    dataService.addUser(user, function (response) {
                        $scope.saved = response.data.saved;
                        $location.path('/profile/' + response.data._id);
                    }, errorCallback);
                } else {
                    $scope.errors = 'All fields required.';

                }

            }

        });
})();