(function() {

  "use strict";

  angular.module('app/settings').controller('SettingsCtrl', function($window, $scope) {
    // Get device width and height
    // TODO: move into service
    $scope.deviceWidth = $window.deviceWidth;    
    $scope.deviceHeight = $window.deviceHeight;    
    // Notifications
    $scope.notify = {
      hour: 12,
      minute: 45
    };
    $scope.$watch('notify.hour', function() {
      setNotification();
    });
    $scope.$watch('notify.minute', function() {
      setNotification();
    });
    // Update notification
    function setNotification() {
    }
  });

}());
