(function() {

  "use strict";

  angular.module('app/state/home/smswarn').config(function($stateProvider) {
    $stateProvider.state('home.smswarn', {
      url: '/smswarn',
      templateUrl: 'app/state/home/smswarn/smswarn.part.html',
      controller: function($scope, $state, settings) {
        $scope.smsSelected = function() {
          // If we dont have a mobile number 
          if(!settings.mobileNumber || settings.mobileNumber === '') {
            // go to mobile select
            $state.go('home.mobileselect');
          } else {
            // Go home
            $state.go('^');
            // Send sms from home controller
            $scope.sendSMS();
          }
        }; 
        $scope.emailSelected = function() {
          // If we dont have an email address 
          if(!settings.emailAddress || settings.emailAddress === '') {
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
          // Go home
          $state.go('^');
        };
      }
    });
  });

}());
