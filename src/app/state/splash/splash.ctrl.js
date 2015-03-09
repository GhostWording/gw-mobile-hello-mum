(function() {

  "use strict";

  angular.module('app/splash').controller('SplashCtrl', function($scope, $location, $timeout, $ionicPlatform, $ionicViewService, texts, localisation, analytics, config, settings) {
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
        // Attempt to fetch texts
        fetchTexts(); 
      }, 1500);
    });
    // Fetch texts from server (or cache)
    function fetchTexts() {
      // If we have shown the welcome texts (n) times
      // NOTE: no welcome texts for spanish language
      if(localisation.getLanguage() === 'es' || 
        (settings.welcomeTextsShownCount !== undefined && 
        settings.welcomeTextsShownCount >= config.showWelcomeTextTimes)) {
        // Trigger a fetch of all texts
        texts.fetch().then(function() {
          // Pick from all texts
          texts.useWelcome(false);
          // Good to go..
          $location.path('/home');
        }, function() {
          // Failed to fetch texts
          $scope.showConnectivityMessage = true;
          // Retry
          $timeout(fetchTexts, config.textFetchRetryDelay * 1000);
        });
      } else {
        // Fetch welcome texts
        texts.fetchWelcome().then(function() {
          // Flag welcome texts as shown
          if(settings.welcomeTextsShownCount === undefined) {
            settings.welcomeTextsShownCount = 1;
          } else {
            settings.welcomeTextsShownCount ++;
          }
          // Save settings
          settings.save(); 
          // Trigger a fetch of all texts in the background
          texts.fetch();
          // Pick from welcome texts
          texts.useWelcome(true);
          // Good to go..
          $location.path('/home');
        }, function() {
          // Failed to fetch texts
          $scope.showConnectivityMessage = true;
          // Retry
          $timeout(fetchTexts, config.textFetchRetryDelay * 1000);
        });
      }
    }
  });

}());
