(function() {

  "use strict";

  angular.module('app/state/splash').controller('SplashCtrl', function($scope, $state, $timeout, $ionicPlatform, $ionicViewService, analytics, settings) {
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
  });

}());
