(function() {

  "use strict";

  angular.module('app/home').controller('HomeCtrl', function($scope, $window, $location, $ionicPopup, $cordovaPreferences, config) {
    // TODO: remove
    var devSettingsPopup;
    $scope.showDevSettings = function() {
      $scope.devSettings = {};
      devSettingsPopup = $ionicPopup.show({
        templateUrl: 'app/home/devsettings.part.html',
        title: 'DEVELOPMENT SETTINGS',
        scope: $scope,
        buttons: [
          { text: 'Close' },
        ]
      });
      devSettingsPopup.then(function() {
        $window.devSettings = $scope.devSettings;
        if(devSettings.mode) {
          console.log($window.devSettings);
          switch(devSettings.mode) {
            case 'a': $location.path('/modea'); break; 
            case 'b': $location.path('/modeb'); break; 
          }
        }
      });
    };
    $scope.modeAClick = function() {
      $scope.devSettings.mode = 'a';
      devSettingsPopup.close();
    };
    $scope.modeBClick = function() {
      $scope.devSettings.mode = 'b';
      devSettingsPopup.close();
    };
  });

}());
