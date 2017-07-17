'use strict';
angular.module('cityChallengeApp').
config(['$locationProvider', '$routeProvider', '$httpProvider',
    function config($locationProvider, $routeProvider, $httpProvider) {


        $routeProvider.
        when('/challenges/', {
            controller: 'ChallengesController',
            controllerAs: 'vm',
            templateUrl: 'templates/challenge-list.template.html',
            isLogin: false
        }).
        when('/challenges/:challengeId', {
            controller: 'ChallengeController',
            controllerAs: 'vm',
            templateUrl: 'templates/challenge-detail.template.html',
            isLogin: true

        }).
        when('/profile', {
            controller : 'ProfileController',
            controllerAs: 'vm',
            templateUrl: 'templates/profile.template.html',
            isLogin: true

        }).
        when('/challenges/current/:currentChallengeId', {
            controller : 'CurrentChallengeController',
            controllerAs: 'vm',
            templateUrl: 'templates/current-challenge.template.html',
            isLogin: true

        }).
        when('/login', {
            controller : 'LoginController',
            controllerAs: 'vm',
            templateUrl: 'templates/login.template.html',
            isLogin: false
        }).
        when('/logout', {
            controller : 'LogoutController',
            controllerAs: 'vm',
            isLogin: false
        }).
        when('/signup', {
            controller: 'SignupController',
            controllerAs: 'vm',
            templateUrl: 'templates/signup.template.html',
            isLogin: false
        }).
        otherwise('/challenges')
    }]);
// All variables defined with the : prefix are extracted into the (injectable) $routeParams object.


