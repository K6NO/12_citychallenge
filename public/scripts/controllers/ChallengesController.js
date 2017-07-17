(function(){
    'use strict';

    angular.module('cityChallengeApp')
        .controller('ChallengesController',  function ($scope, $location, $filter, dataService) {

            // get all challenges
            dataService.getChallenges(function (response) {
                $scope.challenges = response.data;
            });

            $scope.pageIndicator = 'landing-page';
        });
})();