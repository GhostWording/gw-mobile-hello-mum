(function() {

  "use strict";

  angular.module('app/state/home/sendmethod').config(function($stateProvider) {
    $stateProvider.state('home.sendmethod', {
      url: '/sendmethod',
      templateUrl: 'app/state/home/sendmethod/sendmethod.part.html',
      controller: function($scope, $state, settings) {
        // Send SMS
        $scope.sendSMS = function() {
          $state.go('^.smswarn');
        };
        // Cancel
        $scope.cancel = function() {
          $state.go('^');
        };
      }
    });
  });

}());
