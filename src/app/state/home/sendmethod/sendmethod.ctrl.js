(function() {

  "use strict";

  angular.module('app/state/home/sendmethod').controller('SendMethodCtrl', function($scope, $state) {
    // Send SMS
    $scope.sendSMS = function() {
      $state.go('^');
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
  });

}());
