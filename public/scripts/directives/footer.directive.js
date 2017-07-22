'use strict';
cityChallengeApp.directive('footerElement', function () {
   return {
        templateUrl: 'templates/footer.template.html',
        restrict: 'E',
        replace: true
   }
});