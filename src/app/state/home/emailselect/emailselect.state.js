(function() {

  "use strict";

  angular.module('app/state/home/emailselect').config(function($stateProvider) {
    $stateProvider.state('home.emailselect', {
      url: '/emailselect',
      templateUrl: 'app/state/home/emailselect/emailselect.part.html',
      controller: function($scope, $state, settings) {
        // Put settings on the scope
        $scope.settings = settings;
        // Ok 
        $scope.ok = function() {
          // Go home
          $state.go('^');
          // Send email from home controller
          $scope.sendEmail();
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
