'use strict';
angular.module('cityChallengeApp').
    factory('authService',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http) {
            var user = null;
            var loggedInUser = null;

            function isLoggedIn() {

                if(user) {
                    return true;
                } else {
                    return false;
                }
            }

            function getUserStatus() {
                return $http.get('/auth/loggedin')
                    .then(function (response) {
                        if(response.data.status === false) {
                            user = false;
                        } else {
                            user = true;
                            console.log('setting logged in user: ')
                            loggedInUser = response.data.user;
                        }
                    });
            }

            function getLoggedInUser(){
                if (loggedInUser) {
                    console.log('in getLoggedInUSer: ');
                    return loggedInUser;
                } else {
                    return false;
                }
            }

            function login(email, password) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/auth/login',
                    {emailAddress: email, password: password})
                    // handle success, set loggedInUser and user status
                    .then(function (response) {
                        if(response.status === 200){
                            user = true;
                            loggedInUser = response.data;
                            deferred.resolve();
                        } else {
                            user = false;
                            deferred.reject();
                        }
                    })
                    // handle error
                    .catch(function (data) {
                        user = false;
                        deferred.reject(data);
                    });

                // return promise object
                return deferred.promise;

            }

            function logout() {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a get request to the server
                $http.get('/auth/logout')
                // handle success, set user and loggedInUser to false
                    .then(function () {
                        user = false;
                        loggedInUser = null;
                        deferred.resolve();
                    })
                    // handle error
                    .catch(function () {
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
                // handle success, set loggedInUser and user status
                    .then(function (response) {
                        if(response.status === 200 && response){
                            loggedInUser = response.data;
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    })
                    // handle error
                    .catch(function (data) {
                        deferred.reject(data);
                    });

                // return promise object
                return deferred.promise;

            }

            return({
                isLoggedIn: isLoggedIn,
                getUserStatus: getUserStatus,
                login: login,
                logout: logout,
                register: register,
                getLoggedInUser : getLoggedInUser
            })
}]);

