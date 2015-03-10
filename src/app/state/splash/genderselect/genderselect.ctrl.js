(function() {

  "use strict";

  angular.module('app/state/splash/genderselect').controller('GenderSelectCtrl', function($scope, $state, settings) {
    // Gender selected
    $scope.genderSelected = function(gender) {
      // Store the users gender
      settings.userGender = gender;
      // Go home
      $state.go('home'); 
    };
  });

}());
