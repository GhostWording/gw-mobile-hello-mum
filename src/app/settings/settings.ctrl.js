(function() {

  "use strict";

  angular.module('app/settings').controller('SettingsCtrl', function($window, $scope) {
    // Get device width and height
    // TODO: move into service
    $scope.deviceWidth = $window.deviceWidth;    
    $scope.deviceHeight = $window.deviceHeight;    
    // Watch notificaton hour
    $scope.$watch('settings.notificationHour', function() {
      setNotification();
    });
    // Watch notificaton minute
    $scope.$watch('settings.notificationMinute', function() {
      setNotification();
    });
    // Update notification
    function setNotification() {
      console.log($scope.settings);
    }
  });

}());
