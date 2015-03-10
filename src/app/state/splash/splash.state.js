(function() {

  "use strict";

  angular.module('app/state/splash').config(function($stateProvider) {
    $stateProvider.state('splash', {
      url: '/',
      templateUrl: 'app/state/splash/splash.part.html',
      controller: function(
        $scope, $timeout,
        $state, $ionicPlatform, $ionicViewService,
        analytics, settings) {
        // Report splash page init
        analytics.reportEvent('Init', 'Page', 'Splash', 'Init');        
        // Prevent user from returning to this screen
        $ionicViewService.nextViewOptions({
          disableBack: true
        });
        // When ionic ready
        $ionicPlatform.ready(function() {
          // Hide native splash screen
          if(window.navigator.splashscreen) {
            $timeout(function() {
              window.navigator.splashscreen.hide();
            }, 200);
          }
          // Wait a bit
          $timeout(function() {
            // If we dont know the users gender
            if(!settings.userGender) {
              // Go to gender select
              $state.go('.genderselect');
            } else {
              // Go home
              $state.go('home');
            }
          }, 1500);
        });
      }
    });
  });

}());
