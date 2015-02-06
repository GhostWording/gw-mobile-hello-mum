(function() {

  "use strict";

  angular.module('app/splash').controller('SplashCtrl', function($scope, $location, $ionicViewService, $timeout, texts, localisation, analytics, config, settings) {
    // Report splash page init
    analytics.reportEvent('Init', 'Page', 'Splash', 'Init');        
    // Prevent user from returning to this screen
    $ionicViewService.nextViewOptions({
      disableBack: true
    });
    // Wait a bit
    $timeout(function() {
      // Attempt to fetch texts
      fetchTexts(); 
    }, 1500); 
    // On app return to foreground
    document.addEventListener("resume", appResume, false);
    $scope.$on('$destroy', function() {
      document.removeEventListener("resume", appResume);
    });
    function appResume() {
      // Hide connectivity message
      $scope.showConnectivityMessage = false;
      // Try fetching welcome texts again
      fetchTexts();
      // Apply since we are not in angular world
      $scope.$apply();
    }
    // Fetch texts from server
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
          $location.path('/textselect');
        }, function() {
          // Failed to fetch texts
          $scope.showConnectivityMessage = true;
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
          $location.path('/textselect');
        }, function() {
          // Failed to fetch texts
          $scope.showConnectivityMessage = true;
        });
      }
    }
  });

}());
