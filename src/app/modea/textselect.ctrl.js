(function() {

  "use strict";

  angular.module('app/textselect').controller('TextSelectModeACtrl', function($scope, $window, $document, $cordovaPreferences, config, settings, texts) {
    var imageIndex = Math.floor(Math.random()*config.imageUrls.length);
    var textImageMap = {};
    // TODO: remove once we pick from contacts (#12)
    $scope.emailAddress = settings.emailAddress;
    $scope.mobileNumber = settings.mobileNumber;
    // Get device width and height
    // TODO: move into service
    $scope.deviceWidth = $window.deviceWidth;    
    $scope.deviceHeight = $window.deviceHeight;    
    // Calculate slide image height
    $scope.slideImageHeight = $scope.deviceHeight * 0.50;
    // Fetch text list
    texts.fetch(config.area, config.intentionSlug, config.recipientId, function(textList) {
      // Pick 6 texts
      $scope.textList = [];
      for(var i=0; i<6; i++) {
        var text;
        do {
          text = texts.suggest();
        } while($scope.textList.indexOf(text) !== -1); 
        $scope.textList.push(text);
      }
    });
    // Given a text, get the next one in the sequence
    $scope.getNextText = function(currentText) {
      var text;
      // If no current text
      if(!currentText) {
        // Use the first in the sequence 
        text = $scope.textList[0]; 
      } else {
        var currentTextIndex = $scope.textList.indexOf(currentText);
        if(currentTextIndex === -1) return null;
        // If we are are at the end of the sequence
        if(currentTextIndex > $scope.textList.length-2) {
          // Return "come back tomorrow" text
          text = {Content:'Come back tomorrow for more messages!', TextId:-1}; 
          associateImageWithText(text);
          return text;
        }
        text = $scope.textList[currentTextIndex+1];
      }
      // If no image associated with text
      if($scope.getTextImageUrl(text) === undefined) {
        // Associate one
        associateImageWithText(text);
      }
      // Return text
      return text;  
    };
    // Given a text, get the previous one in the sequence
    $scope.getPreviousText = function(currentText) {
      var currentTextIndex = $scope.textList.indexOf(currentText);
      // If we are on the "come back tomorrow" text
      if(currentTextIndex === -1) {
        // If there are no texts in the sequence
        if($scope.textList.length === 0) {
          // Return null
          return null;
        }
        // Return the last item in the sequence
        return $scope.textList[$scope.textList.length-1];
      }
      // If we are at the beginning of the sequence
      if(currentTextIndex === 0) {
        // Return null
        return null;
      }
      // Return previous text
      return $scope.textList[currentTextIndex-1];
    };
    // Associate an image with a text
    function associateImageWithText(text) {
      // TODO: we need the images on the server to add a link to the send text
      textImageMap[text.TextId] = config.imageUrls[imageIndex]; 
      // Increment image index
      imageIndex++;
      if(imageIndex > config.imageUrls.length-1) imageIndex = 0;
    }
    // Get the url of the image associated with the text
    $scope.getTextImageUrl = function(text) {
      if(!text) return null;
      return textImageMap[text.TextId]; 
    };
    // Like icon clicked
    $scope.likeIconClick = function(item) {
      item.liked = !item.liked;
    };
    // Dislike icon clicked
    $scope.dislikeIconClick = function(item) {
      // Swipe slide off to left
      $scope.swipeLeft();
      // Remove current text from textlist
      var currentTextIndex = $scope.textList.indexOf($scope.currentText);
      $scope.textList.splice(currentTextIndex, 1);
    };
  });
}());
