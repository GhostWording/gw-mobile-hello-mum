(function() {

  "use strict";

  angular.module('app/home').controller('HomeCtrl', function($scope, $cordovaPreferences, config, $window) {
    $scope.mobileChange = function() {
      // TODO: get $cordovaPreferences to work
      //$cordovaPreferences.set('mobile', $scope.mobile);
      $window.tempMobile = $scope.mobile;
    };
    $scope.emailChange = function() {
      // TODO: get $cordovaPreferences to work
      //$cordovaPreferences.set('email', $scope.email);
      $window.tempEmail = $scope.email;
    };
  });

}());
