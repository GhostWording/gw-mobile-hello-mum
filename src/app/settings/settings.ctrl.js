(function() {

  "use strict";

  angular.module('app/settings').controller('SettingsCtrl', function($window, $scope, config, notification) {
    // Get device width and height
    // TODO: move into service
    $scope.deviceWidth = $window.deviceWidth;    
    $scope.deviceHeight = $window.deviceHeight;    
    // Watch notification toggle
    $scope.$watch('settings.notification', function(notification) {
      if(notification) {
        setNotification();
      } else {
        notification.clear();
      }
    });
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
      if($scope.settings.notification) {
        notification.set($scope.settings.notificationHour, $scope.settings.notificationMinute, config.notificationMessage);
      }
    }
  });

}());
