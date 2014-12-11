(function() {

  "use strict";

  angular.module('app/debug').controller('DebugCtrl', function($scope, $location, config, texts) {
    // Clear cache and re-fetch texts
    $scope.refreshTextList = function() {
      // Fetch text list
      texts.setArea(config.area);
      texts.setIntention(config.intention);
      texts.setRecipientType(config.recipientType);
      texts.clear();
      texts.fetch(function(textList) {
        $scope.textList = textList;
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    // Initial fetch
    $scope.refreshTextList();
    // Back button clicked
    $scope.backButtonClick = function() {
      $location.path('/textselect');
    };
    // Get image urls
    $scope.imageUrls = config.imageUrls;
  });

}());
