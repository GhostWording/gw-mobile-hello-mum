(function() {

  "use strict";

  angular.module('app/textselect').controller('TextSelectCtrl', 
    function($scope, $window, $document, $cordovaSms, $cordovaPreferences, config, currentIntention, areasSvc, intentionsSvc, textsSvc, filteredTextListSvc, filtersSvc) {
    // Temporary kitten image url's
    $scope.imageUrls = config.imageUrls;
    console.log($scope.imageUrls);
    // set area
    areasSvc.setCurrentName(config.area);
    // Set current intention
    intentionsSvc.setIntentionSlug(currentIntention); 
    // Fetch texts
    textsSvc.getCurrentTextList('en-EN').then(function(texts) {
      $scope.texts = texts;
      // TODO: filtering and implement issue #33
      $scope.filteredTexts = texts.slice(0, 10);
      console.log($scope.filteredTexts);
    }); 
    // Send text via email
    // TODO: move to service
    $scope.sendViaEmail = function(text, imageUrl) {
      // TODO: get $cordovaPreferences to work
      if($window.tempEmail && $window.tempEmail !== '') {
        cordova.plugins.email.open({
          to: $window.tempEmail,
          subject: 'Hello Mum',
          body: text.Content + '\n\n\n' + imageUrl
        });
      }
    };
    // Send text via SMS
    // TODO: move to service
    $scope.sendViaSMS = function(text, imageUrl) {
      // TODO: get $cordovaPreferences to work
      // Send SMS
      if($window.tempMobile && $window.tempMobile !== '') {
        $cordovaSms.send($window.tempMobile, text.Content + '\n\n' + imageUrl, '');
      }
      // Deselect text
      $scope.deselectText();
    };
    // Send text via Facebook
    // TODO: move to service
    $scope.sendViaFacebook = function(text) {
      alert('send "' + text.Content + '" via Facebook');
    };
    // Change background color on image change
    $scope.$watch('currentImage', function(currentImage) {
      if(currentImage === undefined) currentImage = 0;
      console.log(currentImage);
      console.log(config);
      document.body.style.background = '#' + config.backgroundColours[currentImage];
    });
    // Get current text, based on text slider index
    $scope.getCurrentText = function() {
      return $scope.filteredTexts[$scope.currentText?$scope.currentText:0];
    };
    // Get current image url, based on image slider index
    $scope.getCurrentImageUrl = function() {
      return $scope.imageUrls[$scope.currentImage?$scope.currentImage:0];
    };
  })
  // Filter out texts over a certain length!
  // TODO: remove (see issue
  .filter('temporaryFilterLongTexts', function() {
    return function(texts) {
      var filtered = [];
      angular.forEach(texts, function(text) {
        if(text.Content.length < 600) {
          filtered.push(text);
        }
      });
      return filtered;
    };
  });

}());
