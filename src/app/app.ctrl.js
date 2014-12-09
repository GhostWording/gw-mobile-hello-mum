(function() {

  "use strict";

  angular.module('app').controller('AppCtrl', function($scope, $window, config, settings) {
    // Set settings template
    settings.setTemplateUrl('app/settings/settings.part.html');
    // Get device width and height
    // TODO: move into device service
    var windowElement = angular.element($window);
    $window.deviceWidth = windowElement[0].innerWidth;
    $window.deviceHeight = windowElement[0].innerHeight;
  });

}());
