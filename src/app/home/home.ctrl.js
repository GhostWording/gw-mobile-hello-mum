(function() {

  "use strict";

  angular.module('app/home').controller('HomeCtrl', function($scope, $location, $ionicViewService, $timeout, settings) {
    $timeout(function() {
      // Prevent user from returning to this screen
      $ionicViewService.nextViewOptions({
        disableBack: true
      });
      // If we dont know the users gender
      if(!settings.userGender) {
        // Go to gender select
        $location.path('/genderselect');
      } else {
        // Go to text select
        $location.path('/textselect');
      }
    }, 500); 
  });

}());
