(function() {

  "use strict";

  angular.module('app/home').controller('HomeCtrl', function($scope, $location, $ionicViewService, $timeout) {
    $timeout(function() {
      // Prevent user from returning to this screen
      $ionicViewService.nextViewOptions({
        disableBack: true
      });
      // Go to gender select
      $location.path('/genderselect');
    }, 500); 
  });

}());
