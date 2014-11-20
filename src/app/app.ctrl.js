(function() {

  "use strict";

  angular.module('app').controller('AppCtrl', function($scope, $window, config) {
    var windowElement = angular.element($window);
    $window.deviceWidth = windowElement[0].innerWidth;
    $window.deviceHeight = windowElement[0].innerHeight;
  });

}());
