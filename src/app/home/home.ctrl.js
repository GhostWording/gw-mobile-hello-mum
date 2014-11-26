(function() {

  "use strict";

  angular.module('app/home').controller('HomeCtrl', function($scope, $window, $location, $timeout, $ionicPopup, $cordovaPreferences, config) {
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
          // Give the popup a chance to dissapear
          $timeout(function() {
            switch(devSettings.mode) {
              case 'a': $location.path('/modea'); break; 
              case 'b': $location.path('/modeb'); break; 
            }
          }, 250); 
        }
      });
    };
    // Mode A Dev button Clicked
    $scope.modeAClick = function() {
      $scope.devSettings.mode = 'a';
      devSettingsPopup.close();
    };
    // Mode B Dev button Clicked
    $scope.modeBClick = function() {
      $scope.devSettings.mode = 'b';
      devSettingsPopup.close();
    };
    // Close the popup if controller destroyed
    $scope.$on('$destroy', function() {
      devSettingsPopup.close();
    });
  });

}());
