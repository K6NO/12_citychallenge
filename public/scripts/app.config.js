'use strict';
angular.module('cityChallengeApp').
config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        $routeProvider.
        when('/challenges', {
            controller: 'ChallengesController',
            controllerAs: 'vm',
            templateUrl: 'templates/challenge-list.template.html'
        }).
        when('/challenges/:challengeId', {
            controller: 'ChallengeController',
            controllerAs: 'vm',
            templateUrl: 'templates/challenge-detail.template.html'
        }).
        when('/profile/:userId', {
            controller : 'UserController',
            controllerAs: 'vm',
            templateUrl: 'templates/profile.template.html'
        }).
        when('/logout', {
            template: '<p>Logout page - probably only redirects to challenges</p>'
        }).
        when('/signup', {
            template: '<p>Register / sign in</p>'
        }).
        otherwise('/challenges')
    }]);
// All variables defined with the : prefix are extracted into the (injectable) $routeParams object.
