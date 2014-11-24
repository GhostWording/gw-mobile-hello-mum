(function() {

  "use strict";

  angular.module('app/textselect').controller('TextSelectModeACtrl', function($scope, $window, $document, $cordovaPreferences, config, texts) {
    var textImageMap = {};
    var imageIndex = 0;
    // TODO: remove once we pick from contacts (#12)
    $scope.emailAddress = $window.tempEmail;
    $scope.mobileNumber = $window.tempMobile;
    // Get device width and height
    // TODO: move into service
    $scope.deviceWidth = $window.deviceWidth;    
    $scope.deviceHeight = $window.deviceHeight;    
    // Calculate slide image height
    $scope.slideImageHeight = $scope.deviceHeight * 0.50;
    // Fetch text list
    texts.fetch(config.area, config.intentionSlug, config.recipientId, function(textList) {
      // Store text list
      $scope.textList = textList;
    });
    $scope.getNextText = function() {
      // Get a text
      var text = texts.suggest();
      // Associate image with text
      // TODO: we need the images on the server to add a link to the send text
      textImageMap[text.TextId] = config.imageUrls[imageIndex]; 
      // Increment image index
      imageIndex++;
      if(imageIndex > config.imageUrls.length-1) imageIndex = 0;
      // Return text
      return text;  
    };
    // Get the url of the image associated with the text
    $scope.getTextImageUrl = function(text) {
      return textImageMap[text.TextId]; 
    };
    $scope.swipeLeft = function() {
    };
    $scope.swipeRight = function() {
    };
  });
}());
