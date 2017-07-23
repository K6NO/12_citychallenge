(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('ProfileController', ['$scope', '$location', '$filter', 'dataService', 'authService',
            function ($scope, $location, $filter, dataService, authService) {

                //console.log('in user controller');
                //console.log(user);
                $scope.pageIndicator = 'profile-page';

                let user = authService.getLoggedInUser();
                $scope.user = user;
                console.log(user._id);
                console.log(user);


                dataService.getCurrentChallengesForUser(function (response) {
                    $scope.currentChallenges = response.data;
                }, function (response) {
                    $scope.errors = response.data.errors;
                });

                let ranks = {
                    1 : 'Initiate',
                    2 : 'Waking Consciousness',
                    3 : 'Deep Dreaming',
                    4 : 'Inner Silence',
                    5 : 'Awakening',
                    6 : 'Eternal Sunshine',
                    7 : 'Mindful Inner Peace',
                    8 : 'Spirit Being'
                };

                $scope.rank = ranks[user.level];
            }]);
})();