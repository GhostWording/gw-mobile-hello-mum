(function() {

  "use strict";

  angular.module('state/home/mobileselect').config(function($stateProvider) {
    $stateProvider.state('home.mobileselect', {
      url: '/mobileselect',
      templateUrl: 'state/home/mobileselect/mobileselect.part.html',
      controller: function($scope, $state, settings) {
        // Put settings on the scope
        $scope.settings = settings;
        // Ok 
        $scope.ok = function() {
          // Go home
          $state.go('^');
          // Send sms from home controller
          $scope.sendSMS();
        };
        // Cancel
        $scope.cancel = function() {
          // Go home
          $state.go('^');
        };
      }
    });
  });

}());
