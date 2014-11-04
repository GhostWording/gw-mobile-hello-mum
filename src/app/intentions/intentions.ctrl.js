(function() {

  "use strict";

  angular.module('app/intentions').controller('IntentionsCtrl', function($scope, $window, $cordovaSms, $cordovaPreferences, config, areasSvc, intentionsSvc) {
    // Get intentions for area
    // TODO: find out why this doesn't work.. see #17
    intentionsSvc.getIntentionsForArea(config.area).then(function(intentions) {
      $scope.intentions = intentions;
    });
  });
}());
