//(function() {
    'use strict';

    var cityChallengeApp = angular.module('cityChallengeApp', ['ngRoute', 'navbar']);


// Verify logged in status on each restricted route every time when view changes
cityChallengeApp.run(function ($rootScope, $location, $route, authService) {
    $rootScope.$on('$routeChangeStart',
        function (event, next) {
            authService.getUserStatus()
                .then(function () {
                    console.log('Next view requires login? : ' + next.isLogin);
                    if(next.isLogin && !authService.isLoggedIn()){
                        $rootScope.savedLocation = $location.url();
                        $location.path('/login');
                        //$route.reload();
                    } else {
                        console.log('logged in or login not required!')
                    }
                })

    })
});
//});
