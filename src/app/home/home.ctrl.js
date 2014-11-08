(function() {

  "use strict";

  angular.module('app/home').controller('HomeCtrl', function($scope, $cordovaPreferences, config, $window) {
    $scope.mobile = $window.tempMobile;
    $scope.mobileChange = function() {
      // TODO: get $cordovaPreferences to work
      //$cordovaPreferences.set('mobile', $scope.mobile);
      $window.tempMobile = $scope.mobile;
    };
    $scope.email = $window.tempEmail;
    $scope.emailChange = function() {
      // TODO: get $cordovaPreferences to work
      //$cordovaPreferences.set('email', $scope.email);
      $window.tempEmail = $scope.email;
    };
  });

}());
