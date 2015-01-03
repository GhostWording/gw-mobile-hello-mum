(function() {

  "use strict";

  angular.module('app/debug').controller('DebugCtrl', function($scope, $location, $timeout, config, texts, settings, analytics) {
    // Clear cache and re-fetch texts
    $scope.refreshTextList = function() {
      // Fetch text list
      texts.clear();
      texts.fetch(function() {
        // Get all texts  
        $scope.intentions = texts.getAll();
        console.log($scope.intentions);
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
      $location.path('/textselect');
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
  });

}());
