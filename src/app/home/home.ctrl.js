(function() {

  "use strict";

  angular.module('app/home').controller('HomeCtrl', function($scope, $location, $ionicViewService, $timeout) {
    $timeout(function() {
      // Prevent user from returning to this screen
      $ionicViewService.nextViewOptions({
        disableBack: true
      });
      // Go to main view
      $location.path('/textselect');
    }, 500); 
  });

}());
