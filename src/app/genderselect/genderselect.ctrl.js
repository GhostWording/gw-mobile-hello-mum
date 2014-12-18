(function() {

  "use strict";

  angular.module('app/genderselect').controller('GenderSelectCtrl', function($scope, $location, $ionicViewService, $timeout) {
    // Prevent user from returning to this screen
    $ionicViewService.nextViewOptions({
      disableBack: true
    });
    $scope.maleGenderClick = function() {
      // Go to text select
      $location.path('/textselect');
    };
    $scope.femaleGenderClick = function() {
      // Go to text select
      $location.path('/textselect');
    };
  });

}());
