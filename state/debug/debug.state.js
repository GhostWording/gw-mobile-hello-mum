(function() {

  "use strict";

  angular.module('app/state/debug').config(function($stateProvider) {
    $stateProvider.state('debug', {
      url: '/debug',
      templateUrl: 'app/state/debug/debug.part.html',
      controller: function(
        /* ANG */ $scope, $timeout, 
        /* 3RD */ $state,
        /* GMC */ settings, analytics,
        /* APP */ config, texts) {
        // Clear cache and re-fetch texts
        $scope.refreshTextList = function() {
          // Fetch text list
          texts.clear();
          texts.fetch().then(function() {
            // Get all texts  
            $scope.intentions = texts.getAll();
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
          });
        };
        // Initial fetch
        // NOTE: delay so the view transistion happens immediately
        $timeout(function() {
          $scope.refreshTextList();
        }, 1000);
        // Back button clicked
        $scope.backButtonClick = function() {
          $state.go('home');
        };
        // Clear local storage
        $scope.clearLocalStorageClick = function() {
          // Clear settings
          settings.clear();
          // Clear local storage
          localStorage.clear();
          // Clear analytic events
          $scope.analyticEvents = null;
          alert('cleared');
        };
        // Get image urls
        $scope.imageUrls = config.imageUrls;
        // Get analytic events
        $scope.analyticEvents = analytics.getEvents();   
      }
    });
  });

}());
