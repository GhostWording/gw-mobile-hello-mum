(function() {

  "use strict";

  angular.module('app/state/splash/genderselect').config(function($stateProvider) {
    $stateProvider.state('splash.genderselect', {
      url: '/genderselect',
      templateUrl: 'app/state/splash/genderselect/genderselect.part.html',
      controller: function($scope, $state, settings) {
        // Gender selected
        $scope.genderSelected = function(gender) {
          // Store the users gender
          settings.userGender = gender;
          // Go home
          $state.go('home'); 
        };
      }
    });
  });

}());
