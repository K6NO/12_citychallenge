(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('ProfileController', ['$scope', '$location', '$filter', 'dataService', 'authService',
            function ($scope, $location, $filter, dataService, authService) {

                let ranks = {
                    1 : 'Initiate',
                    2 : 'Deep Dreamer',
                    3 : 'Waking Consciousness',
                    4 : 'Inner Silence',
                    5 : 'Awakened',
                    6 : 'Funny Pigeon',
                    7 : 'Bearer of Light',
                    8 : 'Eternal Space'
                };

                $scope.pageIndicator = 'profile-page';

                authService.getLoggedInUser(function (response) {
                    if (response.data.status === false) {
                        // redirect to login page
                    } else {
                        $scope.user = response.data.user;
                        $scope.rank = ranks[$scope.user.level];
                    }
                }, function (error) {
                    $scope.errors = error.data.errors;
                });

                dataService.getCurrentChallengesForUser(function (response) {
                    $scope.currentChallenges = response.data;
                }, function (error) {
                    $scope.errors = error.data.errors;
                });


            }]);
})();