(function() {

  "use strict";

  angular.module('app/textselect').controller('TextSelectCtrl', function($scope, $http, $window, $location, $timeout, $interval, $ionicScrollDelegate, $translate, mumPetName, config, settings, analytics, sendSMS, sendEmail, sendFacebook, texts, helperSvc) {
    var textImageMap = {};
    // Report text select page init
    analytics.reportEvent('Init', 'Page', 'TextSelect', 'Init');
    // Get device width and height
    // TODO: move into service
    $scope.deviceWidth = $window.deviceWidth;    
    $scope.deviceHeight = $window.deviceHeight;    
    // Calculate slide image height
    $scope.slideImageHeight = $scope.deviceHeight * config.imageHeightFactor;
    // Put settings on the scope
    $scope.settings = settings;
    // Default to bottom bar visible
    $scope.bottomBarVisible = true;
    // Translate eof text
    $translate('EOF_TEXT').then(function (eofText) {
      $scope.eofText = eofText;
    });
    $timeout(function() {
      // Pop up gender select if we don't know the users gender
      if(!settings.userGender) {
        $scope.genderSelectPopupVisible = true;
      } else {
        // Just flash the arrows
        flashSwipeArrows();
      }
    }, 1000);
    // Male gender selected
    $scope.maleGenderSelected = function() {
      settings.userGender = 'Male';
      settings.save();
      $scope.genderSelectPopupVisible = false;
      flashSwipeArrows();
    };
    // Female  gender selected
    $scope.femaleGenderSelected = function() {
      settings.userGender = 'Female';
      settings.save();
      $scope.genderSelectPopupVisible = false;
      flashSwipeArrows();
    };
    // Flash swipe arrows
    function flashSwipeArrows() {
      $scope.swipeArrowsVisible = false;
      var swipeArrowFlashCount = 0;
      var swipeArrowInterval = $interval(function() {
        $scope.swipeArrowsVisible = !$scope.swipeArrowsVisible;
        swipeArrowFlashCount++;
        if(swipeArrowFlashCount > 19) $interval.cancel(swipeArrowInterval);
      }, 200);
    }
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
      // Report Text Swipe
      analytics.reportEvent('Text', $scope.currentText.text.TextId, 'TextSelect', 'Swipe'); 
    };
    // Image slide swiped
    $scope.imageSwiped = function() {
      // Report Image Swipe
      analytics.reportEvent('Photo', $scope.currentImage, 'TextSelect', 'Swipe'); 
    };
    // Image left swipe arrow clicked
    $scope.imageLeftSwipeArrowClick = function() {
      $scope.imageSwipeRight();
    };
    // Image right swipe arrow clicked
    $scope.imageRightSwipeArrowClick = function() {
      $scope.imageSwipeLeft();
    };
    // Text left swipe arrow clicked
    $scope.textLeftSwipeArrowClick = function() {
      $scope.textSwipeRight();
    };
    // Text right swipe arrow clicked
    $scope.textRightSwipeArrowClick = function() {
      $scope.textSwipeLeft();
    };
    // Load message image urls
    $http.get('messageimages.json').success(function(imageUrls) {
      // Pick images
      $scope.imageList = pickImages(imageUrls, config.imagesPerDay);
      // Load texts
      loadTexts(); 
    });
    // Watch mum pet name setting, and re-replace on change
    $scope.$watch('settings.mumPetName', function() {
      replacePetNames($scope.textList, settings.mumPetName);
    });
    // On app return to foreground
    document.addEventListener("resume", function() {
      // Reselect texts
      $scope.textList = null;
      $scope.currentText = null;
      $scope.$apply();
      $timeout(function() {
        loadTexts(); 
      });
    }, false);
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
          text = {text:{Content:$scope.eofText, TextId:-1}}; 
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
    // Is the passed text a quote?
    $scope.textIsQuote = function(text) {
      if(!text) return false;
      return helperSvc.isQuote(text); 
    };
    // Is the passed text a thought?
    $scope.textIsThought = function(text) {
      if(!text) return false;
      return text.IntentionId === '2E2986' ||
        text.IntentionId === '67CC40';
    };
    // Is the passed text a joke?
    $scope.textIsJoke = function(text) {
      if(!text) return false;
      return text.IntentionId === '0B1EA1';
    };
    // End of text visible?
    $scope.endOfTextVisible = function() {
      return $scope.textList.indexOf($scope.currentText) === -1;
    };
    // End of image visible?
    $scope.endOfImageVisible = function() {
      return $scope.imageList.indexOf($scope.currentImage) === -1;
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
      $scope.smsImagePopupVisible = false;
    };
    // Returns true if the passed email is valid
    // TODO: move to send 
    $scope.emailAddressValid = function() {
      // TODO: make this better
      return settings.emailAddress && settings.emailAddress!=='';
    };
    // Returns true if the passed mobile number is valid
    // TODO: move to send 
    $scope.mobileNumberValid = function() {
      // TODO: make this better
      return settings.mobileNumber && settings.mobileNumber!=='';
    };
    // Send via SMS
    $scope.sendSMS = function() {
      // Save the settings
      settings.save();
      // Hide the send popup
      $scope.sendPopupVisible = false;
      // If the sms image warning or sms contact picker popups are visible
      if($scope.smsImagePopupVisible || $scope.smsContactPopupVisible) {
        // Hide the SMS image warning poup
        $scope.smsImagePopupVisible = false;
        // Hide the SMS contact picker
        $scope.smsContactPopupVisible = false;
        // If we have a mobile number 
        if($scope.mobileNumberValid()) {
          // Send the SMS
          sendSMS.setMobileNumber(settings.mobileNumber);
          sendSMS.send(prepareContentForSending()).then(function() {
            // Report SMS send
            analytics.reportEvent('Text', $scope.currentText.text.TextId, 'TextSelect', 'smssend');
            // Show sent popup
            showSentPopup();
          }, function() {
            // Report SMS send fail
            analytics.reportEvent('Text', $scope.currentText.text.TextId, 'TextSelect', 'smssendfail');
            // Show error popup
            showErrorPopup();
          }); 
        } else {
          // Show the sms contact popup
          $scope.smsContactPopupVisible = true;
        }
      } else {
        // Show the SMS image warning popup
        $scope.smsImagePopupVisible = true;
      }
    };
    // Send via Email
    $scope.sendEmail = function() {
      // Save the settings
      settings.save();
      // Hide the send popup
      $scope.sendPopupVisible = false;
      // Hide the Email contact picker
      $scope.emailContactPopupVisible = false;
      // Hide the SMS image warning poup
      $scope.smsImagePopupVisible = false;
      // If we have a valid email address 
      if($scope.emailAddressValid()) {
        // Get the email subject
        $translate('EMAIL_SUBJECT_' + $scope.settings.emailSubjectIndex).then(function(emailSubject) {
          // Send the Email
          sendEmail.setEmailAddress(settings.emailAddress);
          sendEmail.setAttachmentPath($scope.currentImage);
          sendEmail.send(mumPetName.replace(emailSubject, settings.mumPetName), prepareContentForSending());
          // Report email send
          analytics.reportEvent('Text', $scope.currentText.text.TextId, 'TextSelect', 'emailsend');
        });
      } else {
        // Show the contact popup
        $scope.emailContactPopupVisible = true;
      }
    };    
    // Send via Facebook
    $scope.sendFacebook = function() {
      // Hide the send popup
      $scope.sendPopupVisible = false;
      // Alert for now..
      // TODO: implement
      alert('sending "' + prepareContentForSending() + '" via Facebook');
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
      $scope.smsContactPopupVisible = false;
      $scope.emailContactPopupVisible = false;
    };
    // Load and select texts
    function loadTexts() {
      // If welcome texts have been shown twice
      if(settings.welcomeTextsShownCount !== undefined && settings.welcomeTextsShownCount >= config.showWelcomeTextTimes) {
        // Trigger a fetch of all texts
        texts.fetch().then(function() {
          // Choose (n) texts from all texts
          $scope.textList = texts.choose(config.textsPerDay);
          // Replace mother pet names with the one in settings
          replacePetNames($scope.textList, settings.mumPetName);
        }, function() {
          // TODO: improve this
          alert('no internet connectivity');
        });
      } else {
        // Fetch welcome texts
        texts.fetchWelcome().then(function() {
          $scope.textList = texts.chooseWelcome(config.textsPerDay);
          // Replace mother pet names with the one in settings
          replacePetNames($scope.textList, settings.mumPetName);
          // Trigger a fetch of all texts
          texts.fetch();
          // Flag welcome texts as shown
          if(settings.welcomeTextsShownCount === undefined) {
            settings.welcomeTextsShownCount = 1;
          } else {
            settings.welcomeTextsShownCount ++;
          }
          // Save settings
          settings.save(); 
        }, function() {
          // TODO: improve this
          alert('no internet connectivity');
        });
      }
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
    // Prepare text content for sending 
    function prepareContentForSending() {
      // Get current text
      var text = $scope.currentText.text;
      // Get current text content
      var content = text.Content;
      // Add intention label
      if($scope.currentText.intention.label) {
        content = $scope.currentText.intention.label + ' - ' + content;
      }
      // Add author if quote
      if($scope.textIsQuote(text)) {
        content += ' - ' + text.Author;
      }
      // Return prepared content
      return content;
    }
    // Show sent popup
    function showSentPopup() {
      // Show the SMS sent popup
      $scope.sentPopupVisible = true;
      // And hide it after 1 second
      $timeout(function() {
        $scope.sentPopupVisible = false;
      }, 1000);
    }
    // Show error popup
    function showErrorPopup() {
      // Show the error popup
      $scope.errorPopupVisible = true;
      // And hide it after 1 second
      $timeout(function() {
        $scope.errorPopupVisible = false;
      }, 1000);
    }
    // Replace mother pet names
    function replacePetNames(textList, replacement) {
      if(textList) {
        for(var i=0; i<textList.length; i++) {
          textList[i].text.Content = mumPetName.replace(textList[i].text.Content, replacement); 
        }
      }
    }
  });

}());
