(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('SignupController',  function ($scope, $location, $filter, dataService, authService) {


            $scope.pageIdentifier = 'signup-page';
            $scope.user = {};


            // get all challenges
            $scope.register = function (user) {
                if(user.fullName && user.userName && user.emailAddress && user.password) {
                    authService.register(user)
                        .then(function (response) {
                            console.log(response);
                            $scope.disabled = false;
                            $scope.signupForm = {};
                            $location.path('/profile')})
                        .catch(
                            function () {
                                $scope.errors = 'All fields required.';
                                $scope.error = true;
                                $scope.disabled = false;
                                $scope.signupForm = {};
                            })
                } else {
                    $scope.errors = 'All fields required.';
                }
            }

        });
})();