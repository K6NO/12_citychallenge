(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('SignupController', ['$scope', '$location', '$filter', 'dataService', 'authService',
            function ($scope, $location, $filter, dataService, authService) {

                $scope.errors = [];
                $scope.pageIdentifier = 'signup-page';
                $scope.user = {};
                $scope.selectedProfilePic = 0;

                $scope.chooseProfilePic = function (clickedItem) {
                    let profilePicUrl = clickedItem.target.attributes.src.value;
                    $scope.selectedProfilePic = clickedItem.target.attributes.id.value;
                    $scope.user.photoUrl = profilePicUrl;
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
                                    $scope.user.password = '';
                                    $scope.errors.push(error.data);
                                })
                    } else {
                        $scope.user.password = '';
                        $scope.errors.push('Fill in all fields and choose a profile pic.');
                    }
                }

            }]);
})();