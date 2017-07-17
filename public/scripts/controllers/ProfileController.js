(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('ProfileController',  function ($scope, $location, $filter, dataService, authService) {

            //console.log('in user controller');
            //console.log(user);
            $scope.pageIndicator = 'profile-page';



            let user = authService.getLoggedInUser();
            $scope.user = user;
            console.log(user._id);


            dataService.getCurrentChallengesForUser(function (response) {
                $scope.currentChallenges = response.data;
            }, function (response) {
                $scope.errors = response.data.errors;
            });

            // add user
            //$scope.addNewUser = function () {
            //    dataService.addUser($scope.user, function (user) {
            //        console.log(user);
            //        $scope.user = user;
            //        $location.path('/profile');
            //    }, function (response) {
            //        $scope.errors = response.data.errors;
            //    });
            //};


            // update user
            //$scope.updateUserInfo = function () {
            //    dataService.updateUser(userId, $scope.user, function (user) {
            //        console.log(user);
            //        $scope.user = user;
            //        $location.path('/profile');
            //    }, function (response) {
            //        $scope.errors = response.data.errors;
            //    });
            //};
        });
})();