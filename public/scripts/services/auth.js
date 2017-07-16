'use strict';
angular.module('cityChallengeApp').
    factory('authService',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http) {
        var user = null;
            function isLoggedIn() {
                if(user) {
                    return true;
                } else {
                    return false;
                }
            }

            function getUserStatus() {
                return user;
            }

            function login(email, password) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/auth/login',
                    {emailAddress: email, password: password})
                    // handle success
                    .then(function (data) {

                        if(data.status === 200){
                            user = true;
                            deferred.resolve();
                        } else {
                            user = false;
                            deferred.reject();
                        }
                    })
                    // handle error
                    .catch(function (data) {
                        user = false;
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function logout() {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a get request to the server
                $http.get('/auth/logout')
                    // handle success
                    .then(function (data) {
                        user = false;
                        deferred.resolve();
                    })
                    // handle error
                    .catch(function (data) {
                        user = false;
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;
            }

            function register(user) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/auth/signup',
                    user)
                    // handle success
                    .then(function (user, status) {
                        if(status === 200 && user){
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    })
                    // handle error
                    .catch(function (data) {
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            return({
                isLoggedIn: isLoggedIn,
                getUserStatus: getUserStatus,
                login: login,
                logout: logout,
                register: register
            })
}]);

