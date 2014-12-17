(function() {

  "use strict";

  angular.module('app/settings').controller('SettingsCtrl', function($window, $scope) {
    // Get device width and height
    // TODO: move into service
    $scope.deviceWidth = $window.deviceWidth;    
    $scope.deviceHeight = $window.deviceHeight;    
  });

}());
