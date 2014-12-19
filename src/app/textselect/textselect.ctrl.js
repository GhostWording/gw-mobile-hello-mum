(function() {

  "use strict";

  angular.module('app/textselect').controller('TextSelectCtrl', function($scope, $window, $location, $ionicScrollDelegate, config, settings, sendSMS, sendEmail, sendFacebook, texts) {
    var imageIndex = Math.floor(Math.random()*config.imageUrls.length);
    var textImageMap = {};
    // Get device width and height
    // TODO: move into service
    $scope.deviceWidth = $window.deviceWidth;    
    $scope.deviceHeight = $window.deviceHeight;    
    // Calculate slide image height
    $scope.slideImageHeight = $scope.deviceHeight * config.imageHeightFactor;
    // Pick images
    $scope.imageList = pickImages(config.imageUrls, config.imagesPerDay);
    // Put settings on the scope
    $scope.settings = settings;
    // Default to bottom bar visible
    $scope.bottomBarVisible = true;
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
    // Get the index of the current image slide for the dot indicator
    $scope.getImageIndex = function(currentImage) {
      var index = $scope.imageList.indexOf(currentImage);
      // Account for eof image
      if(index === -1) {
        index = $scope.imageList.length;
      }
      return index;
    }; 
    // Text slide swiped
    $scope.textSwiped = function() {
      $ionicScrollDelegate.scrollTop(true); 
    };
    // Fetch all texts
    texts.fetch(function() {
      // choose (n) texts 
      $scope.textList = texts.choose(config.textsPerDay);
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
          text = {text:{Content:'See you tomorrow for more messages!', TextId:-1}}; 
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
    // Get the index of the current text slide for the dot indicator
    $scope.getTextIndex = function(currentText) {
      if(!$scope.textList) return null;
      var index = $scope.textList.indexOf(currentText);
      // Account for eof text
      if(index === -1) {
        index = $scope.textList.length;
      }
      return index;
    }; 
    // End of text visible
    $scope.endOfTextVisible = function() {
      return $scope.textList.indexOf($scope.currentText) === -1;
    };
    // Like button clicked
    $scope.likeButtonClick = function(item) {
      item.liked = !item.liked;
    };
    // Dislike button clicked
    $scope.dislikeButtonClick = function(item) {
      $scope.swipeLeft();
      // Remove current text from textlist
      var currentTextIndex = $scope.textList.indexOf($scope.currentText);
      $scope.textList.splice(currentTextIndex, 1);
      $scope.currentText = $scope.textList[currentTextIndex];
    };
    // Send button clicked
    $scope.sendButtonClick = function() {
      $scope.sendPopupVisible = true;
    };
    // Send cancel button clicked
    $scope.sendCancelButtonClick = function() {
      $scope.sendPopupVisible = false;
    };
    // Returns true if the passed email is valid
    // TODO: move to send 
    $scope.emailAddressValid = function(emailAddress) {
      // TODO: make this better
      return settings.emailAddress && settings.emailAddress!=='';
    };
    // Returns true if the passed mobile number is valid
    // TODO: move to send 
    $scope.mobileNumberValid = function(mobileNumber) {
      // TODO: make this better
      return settings.mobileNumber && settings.mobileNumber!=='';
    };
    // Send via SMS
    $scope.sendSMS = function() {
      // Hide the send popup
      $scope.sendPopupVisible = false;
      // Set the send method to SMS
      $scope.sendMethod = 'SMS';
      // If we have a mobile number 
      if($scope.mobileNumberValid(settings.mobileNumber)) {
        // Send the SMS
        sendSMS.setMobileNumber(settings.mobileNumber);
        sendSMS.send($scope.currentText.text.Content); 
      } else {
        // Show the contact popup
        $scope.contactPopupVisible = true;
      }
    };
    // Send via Email
    $scope.sendEmail = function() {
      // Hide the send popup
      $scope.sendPopupVisible = false;
      // Set the send method to Email
      $scope.sendMethod = 'Email';
      // If we have a valid email address 
      if($scope.emailAddressValid(settings.emailAddress)) {
        // Send the Email
        sendEmail.setEmailAddress(settings.emailAddress);
        sendEmail.send(config.emailSubject, $scope.currentText.text.Content); 
      } else {
        // Show the contact popup
        $scope.contactPopupVisible = true;
      }
    };
    // Send via Facebook
    $scope.sendFacebook = function() {
      // Hide the send popup
      $scope.sendPopupVisible = false;
      // Alert for now..
      // TODO: implement
      alert('sending "' + $scope.currentText.text.Content + '" via Facebook');
    };
    // Determine contact send button visiblity
    $scope.contactSendButtonVisible = function() {
      return ($scope.sendMethod==='SMS' && $scope.mobileNumberValid(settings.mobileNumber)) || 
        ($scope.sendMethod==='Email' && $scope.emailAddressValid(settings.emailAddress)); 
    };
    // Send clicked on the contact picker
    $scope.contactSendButtonClick = function() {
      // Hide the contact popup
      $scope.contactPopupVisible = false;
      // TODO: validate
      switch($scope.sendMethod) {
        case 'SMS': {
          // Send the SMS
          sendSMS.setMobileNumber(settings.mobileNumber);
          sendSMS.send($scope.currentText.text.Content); 
          break;
        }
        case 'Email': {
          // Send the Email
          sendEmail.setEmailAddress(settings.emailAddress);
          sendEmail.send(config.emailSubject, $scope.currentText.text.Content); 
          break;
        }
      }
    };
    // Settings button clicked
    $scope.settingsButtonClick = function() {
      settings.show();  
    };
    // Debug button clicked
    var debugClickCount = 0;
    var previousClickTime = new Date().getTime(); 
    $scope.debugButtonClick = function() {
      var currentClickTime = new Date().getTime(); 
      if(currentClickTime - previousClickTime > 500) {
        debugClickCount = 0;
      }
      previousClickTime = currentClickTime; 
      debugClickCount ++;
      if(debugClickCount === 3) {
        debugClickCount = 0;
        $location.path('/debug');
      }
    };
    $scope.contactOkButtonClick = function() {
      $scope.contactPopupVisible = false;
    };
    $scope.contactCancelButtonClick = function() {
      $scope.contactPopupVisible = false;
    };
    // Select (n) unique texts
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
    // Select (n) unique images
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
