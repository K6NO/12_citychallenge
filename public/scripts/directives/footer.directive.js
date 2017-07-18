'use strict';
cityChallengeApp.directive('footerElement', function () {
   return {
        templateUrl: 'templates/footer.template.html',
        restrict: 'E',
        replace: true
   }
});

//controller: ['$scope', '$filter', function ($scope, $filter) {
//    console.log('from directive');
//}]