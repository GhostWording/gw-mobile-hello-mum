(function() {

  "use strict";

  angular.module('app/home').controller('HomeCtrl', function($scope, $location, $ionicViewService, $timeout, settings, texts, localisation, analytics) {
    $timeout(function() {
      // Report home page init
      analytics.reportEvent('Init', 'Page', 'Home', 'Init');        
      // Prevent user from returning to this screen
      $ionicViewService.nextViewOptions({
        disableBack: true
      });
      // Set text language
      texts.setLanguage(localisation.getLanguage().split('-')[0]);
      // Fetch welcome texts
      texts.fetchWelcome().then(function() {
        // If we dont know the users gender
        if(!settings.userGender) {
          // Go to gender select
          $location.path('/genderselect');
        } else {
          // Go to text select
          $location.path('/textselect');
        }
      }, function() {
        // TODO: improve this
        alert('no internet connectivity');
      });
    }, 500); 
  });

}());
