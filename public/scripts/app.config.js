'use strict';
angular.module('cityChallengeApp').
config(['$locationProvider', '$routeProvider', '$httpProvider',
    function config($locationProvider, $routeProvider, $httpProvider) {

        //var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
        //    // Initialize a new promise
        //    var deferred = $q.defer();
        //
        //    console.log('checking logged in')
        //
        //    // Make an AJAX call to check if the user is logged in
        //    $http.get('/auth/loggedin').success(function(user){
        //        console.log(user);
        //
        //        console.log('http callback');
        //
        //        // Authenticated
        //        if (user !== '0')
        //            deferred.resolve();
        //
        //        // Not Authenticated
        //        else {
        //            $rootScope.message = 'You need to log in.';
        //            deferred.reject();
        //            $location.url('/login');
        //        }
        //    });
        //
        //    return deferred.promise;
        //};

        //================================================
        // Add an interceptor for AJAX errors
        //================================================
        //$httpProvider.interceptors.push(function($q, $location) {
        //    return {
        //        response: function(response) {
        //            console.log('yaaaay');
        //            // do something on success
        //            return response;
        //        },
        //        responseError: function(response) {
        //            if (response.status === 401)
        //                $location.url('/login');
        //            return $q.reject(response);
        //        }
        //    };
        //});

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
        when('/profile', {
            controller : 'UserController',
            controllerAs: 'vm',
            templateUrl: 'templates/profile.template.html',
        }).
        when('/challenges/current/:currentChallengeId', {
            controller : 'CurrentChallengeController',
            controllerAs: 'vm',
            templateUrl: 'templates/current-challenge.template.html'
        }).
        when('/login', {
            controller : 'LoginController',
            controllerAs: 'vm',
            templateUrl: 'templates/login.template.html'
        }).
        when('/logout', {
            template: '<p>Logout page - probably only redirects to challenges</p>'
        }).
        when('/signup', {
            controller: 'SignupController',
            controllerAs: 'vm',
            templateUrl: 'templates/signup.template.html'
        }).
        otherwise('/challenges')
    }]);
// All variables defined with the : prefix are extracted into the (injectable) $routeParams object.


