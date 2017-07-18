(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('SignupController',  function ($scope, $location, $filter, dataService, authService) {

            $scope.errors = [];
            $scope.pageIdentifier = 'signup-page';
            $scope.user = {};

            $scope.chooseProfilePic = function (clickedItem) {
                let dataValue = clickedItem.target.attributes.src.value;
                console.log(dataValue);
                $scope.user.photoUrl = dataValue;
            };

            $scope.removeError = function () {
                $scope.errors = [];
            };


            // get all challenges
            $scope.register = function (user) {
                if(user.fullName && user.userName && user.emailAddress && user.password && user.photoUrl) {
                    authService.register(user)
                        .then(function (response) {
                            console.log(response);
                            $location.path('/profile')})
                        .catch(
                            function (error) {
                                $scope.errors.push(error.data);
                            })
                } else {
                    $scope.errors.push('Fill in all fields and choose a profile pic.');
                }
            }

        });
})();