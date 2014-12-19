(function() {

  "use strict";

  angular.module('app/genderselect').controller('GenderSelectCtrl', function($scope, $location, $ionicViewService, $timeout, settings) {
    // Prevent user from returning to this screen
    $ionicViewService.nextViewOptions({
      disableBack: true
    });
    $scope.maleGenderClick = function() {
      // Save gender to settings
      settings.userGender = 'Male'; 
      settings.save();
      // Go to text select
      $location.path('/textselect');
    };
    $scope.femaleGenderClick = function() {
      // Save gender to settings
      settings.userGender = 'Female'; 
      settings.save();
      // Go to text select
      $location.path('/textselect');
    };
  });

}());
