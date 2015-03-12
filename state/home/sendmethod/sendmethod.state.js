(function() {

  "use strict";

  angular.module('state/home/sendmethod').config(function($stateProvider) {
    $stateProvider.state('home.sendmethod', {
      url: '/sendmethod',
      templateUrl: 'state/home/sendmethod/sendmethod.part.html',
      controller: function($scope, $state, settings) {
        // SMS Selected
        $scope.smsSelected = function() {
          // Go to SMS warning state
          $state.go('^.smswarn');
        };
        // Email selected
        $scope.emailSelected = function() {
          // If we dont have an email address 
          if(!settings.emailAddress || settings.emailAddress==='') {
            // go to email select
            $state.go('home.emailselect');
          } else {
            // Go home
            $state.go('^');
            // Send email from home controller
            $scope.sendEmail();
          }
        };
        // Cancel
        $scope.cancel = function() {
          $state.go('^');
        };
      }
    });
  });

}());
