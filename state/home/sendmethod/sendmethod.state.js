(function() {

  "use strict";

  angular.module('state/home/sendmethod').config(function($stateProvider) {
    $stateProvider.state('home.sendmethod', {
      url: '/sendmethod/:smsEnabled/:emailEnabled/:facebookEnabled',
      templateUrl: 'state/home/sendmethod/sendmethod.part.html',
      controller: function($scope, $state, $stateParams, settings) {
        // Get enabled parameters 
        $scope.smsEnabled = ($stateParams.smsEnabled === 'true');
        $scope.emailEnabled = ($stateParams.emailEnabled === 'true');
        $scope.facebookEnabled = ($stateParams.facebookEnabled === 'true');
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
        // Facebook selected
        $scope.facebookSelected = function() {
          // Go home
          $state.go('^');
          // Send via facebook from home controller
          $scope.sendFacebook();
        };
        // Cancel
        $scope.cancel = function() {
          $state.go('^');
        };
      }
    });
  });

}());
