(function() {

  "use strict";

  angular.module('app/home').controller('HomeCtrl', function($scope, $window, $location, $timeout, $ionicPopup, $cordovaPreferences, config) {
    $timeout(function() {
      $location.path('/modec');
    }, 2000); 
  });

}());
