(function() {

  "use strict";

  angular.module('app/state/home/sendmethod').config(function($stateProvider) {
    $stateProvider.state('home.sendmethod', {
      url: '/sendmethod',
      templateUrl: 'app/state/home/sendmethod/sendmethod.part.html',
      controller: function($scope, $state) {
        // Send SMS
        $scope.sendSMS = function() {
          $state.go('^.smswarn');
        };
        // Send Email
        $scope.sendEmail = function() {
          $state.go('^');
        };
        // Send Facebook
        $scope.sendEmail = function() {
          $state.go('^');
        };
        // Cancel
        $scope.cancel = function() {
          $state.go('^');
        };
      }
    });
  });

}());
