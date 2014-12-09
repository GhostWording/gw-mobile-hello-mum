(function() {

  "use strict";

  angular.module('app/home').controller('HomeCtrl', function($scope, $window, $location, $timeout, $ionicPopup, $cordovaPreferences, config) {
    // Next arrow clicked
    $scope.launch = function() {
      switch(settings.mode) {
        case 'A': $location.path('/modea'); break; 
        case 'B': $location.path('/modeb'); break; 
        case 'C': $location.path('/modec'); break; 
      }
    };
  });

}());
