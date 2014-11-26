(function() {

  "use strict";

  angular.module('app/home').controller('HomeCtrl', function($scope, $window, $timeout, $ionicPopup, $cordovaPreferences, config) {
    // TODO: remove
    $scope.showDevSettings = function() {
      $scope.data = {};
      var devSettingsPopup = $ionicPopup.show({
        templateUrl: 'app/home/devsettings.part.html',
        title: 'DEVELOPMENT SETTINGS',
        scope: $scope,
        buttons: [
          { text: 'Close' },
        ]
      });
    };
    /*
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
    */
  });

}());
