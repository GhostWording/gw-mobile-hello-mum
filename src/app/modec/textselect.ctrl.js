(function() {

  "use strict";

  angular.module('app/textselectc').controller('TextSelectModeCCtrl', function($scope, $window, $document, config, settings, texts) {
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
    // Pick images
    $scope.imageList = pickImages(config.imageUrls, config.imagesPerDay);
    // Given an image, get the next one in the sequence
    $scope.getNextImage = function(currentImage) {
      var image;
      // If no current image
      if(!currentImage) {
        // Use the first in the sequence 
        image = $scope.imageList[0]; 
      } else {
        var currentImageIndex = $scope.imageList.indexOf(currentImage);
        if(currentImageIndex === -1) return null;
        // If we are are at the end of the sequence
        if(currentImageIndex > $scope.textList.length-2) {
          // Return end of file image
          return config.endOfFileImageUrl;
        }
        image = $scope.imageList[currentImageIndex+1];
      }
      // Return text
      return image;  
    };
    // Given an image, get the previous one in the sequence
    $scope.getPreviousImage = function(currentImage) {
      var currentImageIndex = $scope.imageList.indexOf(currentImage);
      // If we are on the end of file image
      if(currentImageIndex === -1) {
        // If there are no images in the sequence
        if($scope.imageList.length === 0) {
          // Return null
          return null;
        }
        // Return the last image in the sequence
        return $scope.imageList[$scope.imageList.length-1];
      }
      // If we are at the beginning of the sequence
      if(currentImageIndex === 0) {
        // Return null
        return null;
      }
      // Return previous image
      return $scope.imageList[currentImageIndex-1];
    };
    // Fetch text list
    texts.fetch(config.area, config.intentionSlug, config.recipientId, function(textList) {
      // Pick texts
      $scope.textList = pickTexts(config.textsPerDay);
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
          // Return end of file text
          text = {Content:'Come back tomorrow for more messages!', TextId:-1}; 
          return text;
        }
        text = $scope.textList[currentTextIndex+1];
      }
      // Return text
      return text;  
    };
    // Given a text, get the previous one in the sequence
    $scope.getPreviousText = function(currentText) {
      var currentTextIndex = $scope.textList.indexOf(currentText);
      // If we are on the end of file text
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
    function pickTexts(numTexts) {
      var textList = [];
      for(var i=0; i<numTexts; i++) {
        var text;
        do {
          text = texts.suggest();
        } while(textList.indexOf(text) !== -1); 
        textList.push(text);
      }
      return textList;
    }
    function pickImages(candidateImageUrls, numImages) {
      var imageList = [];
      for(var i=0; i<numImages; i++) {
        var image;
        do {
          image = candidateImageUrls[Math.floor(Math.random() * candidateImageUrls.length)];
        } while(imageList.indexOf(image) !== -1); 
        imageList.push(image);
      }
      return imageList;
    }
  });

}());
