(function() {

  "use strict";

  angular.module('app/splash').controller('SplashCtrl', function($scope, $location, $ionicViewService, $timeout, texts, localisation, analytics) {
    $timeout(function() {
      // Report splash page init
      analytics.reportEvent('Init', 'Page', 'Splash', 'Init');        
      // Prevent user from returning to this screen
      $ionicViewService.nextViewOptions({
        disableBack: true
      });
      // Set text language
      texts.setLanguage(localisation.getLanguage().split('-')[0]);
      // Fetch welcome texts
      texts.fetchWelcome().then(function() {
        // Go to text select
        $location.path('/textselect');
      }, function() {
        // TODO: improve this
        alert('no internet connectivity');
      });
    }, 150000); 
  });

}());
