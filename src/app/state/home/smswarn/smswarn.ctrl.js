(function() {

  "use strict";

  angular.module('app/state/home/smswarn').controller('SmsWarnCtrl', function($scope, $state) {
    // Send SMS anyway
    $scope.sendSMS = function() {
      $state.go('^');
    };
    // Send email instead
    $scope.sendEmail = function() {
      $state.go('^');
    };
    // Cancel
    $scope.cancel = function() {
      $state.go('^');
    };
  });

}());
