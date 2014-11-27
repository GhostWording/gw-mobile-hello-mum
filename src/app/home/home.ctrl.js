(function() {

  "use strict";

  angular.module('app/home').controller('HomeCtrl', function($scope, $window, $location, $timeout, $ionicPopup, $cordovaPreferences, config, settings) {
    // Settings icon clicked
    $scope.settingsClick = function() {
      settings.show();
    };
    // Next arrow clicked
    $scope.nextArrowClick = function() {
      switch(settings.tinderMode) {
        case false: $location.path('/modea'); break; 
        case true: $location.path('/modeb'); break; 
      }
    };
  });

}());
