(function() {

  "use strict";

  angular.module('app/genderselect').controller('GenderSelectCtrl', function($scope, $location, $ionicViewService, $timeout, settings, analytics) {
    // Prevent user from returning to this screen
    $ionicViewService.nextViewOptions({
      disableBack: true
    });
    $scope.maleGenderClick = function() {
      // Report male gender click
      analytics.reportEvent('Command', 'MaleGender', 'GenderSelect', 'click');
      // Save gender to settings
      settings.userGender = 'Male'; 
      settings.save();
      // Go to text select
      $location.path('/textselect');
    };
    $scope.femaleGenderClick = function() {
      // Report female gender click
      analytics.reportEvent('Command', 'FemaleGender', 'GenderSelect', 'click');
      // Save gender to settings
      settings.userGender = 'Female'; 
      settings.save();
      // Go to text select
      $location.path('/textselect');
    };
  });

}());
