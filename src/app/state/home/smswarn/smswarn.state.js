(function() {

  "use strict";

  angular.module('app/state/home/smswarn').config(function($stateProvider) {
    $stateProvider.state('home.smswarn', {
      url: '/smswarn',
      templateUrl: 'app/state/home/smswarn/smswarn.part.html',
      controller: function($scope, $state) {
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
      }
    });
  });

}());
