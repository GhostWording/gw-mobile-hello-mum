(function() {

  "use strict";

  angular.module('state/home').config(function($stateProvider) {
    $stateProvider.state('home', {
      url: '/home',
      templateUrl: 'state/home/home.part.html',
      resolve: {
        images: function($http, config) {
          // Get list of all available images
          return $http.get('messageimages.json').then(function(result) {
            // Pick (n) images
            return pickImages(result.data, config.imagesPerDay); 
          });
        },
        texts: function(texts, config) {
          // Fetch all texts
          return texts.fetch().then(function() {
            // Pick (n) texts
            return texts.choose(config.textsPerDay); 
          });
        }
      },
      controller: function(
        /* ANG */ $scope, $window, $timeout, $interval, 
        /* 3RD */ $state, $ionicScrollDelegate, $translate, 
        /* GMC */ settings, analytics, localisation, sendSMS, sendEmail,
        /* GWC */ helperSvc, 
        /* APP */ mumPetName, config, 
        /* RES */ images, texts) {
        // Report home page init
        analytics.reportEvent('Init', 'Page', 'Home', 'Init');
        // Get device width and height
        // TODO: move into service
        $scope.deviceWidth = $window.deviceWidth;    
        $scope.deviceHeight = $window.deviceHeight;    
        // Calculate slide image height
        $scope.slideImageHeight = $scope.deviceHeight * config.imageHeightFactor;
        // Put settings on the scope
        $scope.settings = settings;
        // Put images on the scope
        $scope.images = images;
        // Put texts on the scope
        $scope.texts = texts;
        // Get day of the week
        $scope.dayOfTheWeek = (new Date()).getDay();
        // Slider states
        $scope.textSlider = {};
        $scope.imageSlider = {};
        // Swipe status
        $scope.imageWasSwiped = settings.imageWasSwiped;
        $scope.textWasSwiped = settings.textWasSwiped;
        // Initialise swipe hints
        initSwipeHints();
        $scope.textSwiped = function() {
          // Scroll back to top
          $ionicScrollDelegate.scrollTop(true); 
          // Hide swipe hint
          $scope.textSwipeHintVisible = false;
          // Record swipe
          $scope.textWasSwiped = true;
          // Persist to settings to disable hints
          settings.textWasSwiped = true;
          // Report Text Swipe
          analytics.reportEvent('Text', $scope.textSlider.currentText.text.TextId, 'Home', 'Swipe'); 
        };
        // Image slide swiped
        $scope.imageSwiped = function() {
          // Hide swipe hint
          $scope.imageSwipeHintVisible = false;
          // Record swipe
          $scope.imageWasSwiped = true;
          // Persist to settings to disable hints
          settings.imageWasSwiped = true;
          // Report Image Swipe
          analytics.reportEvent('Photo', $scope.imageSlider.currentImage, 'Home', 'Swipe'); 
        };
        // Watch mum pet name setting, and re-replace on change
        $scope.$watch('settings.mumPetName', function() {
          replacePetNames($scope.texts, settings.mumPetName);
        });
        // On app return to foreground
        document.addEventListener("resume", appResume, false);
        $scope.$on('$destroy', function() {
          document.removeEventListener("resume", appResume);
        });
        function appResume() {
          // If new day
          if((new Date()).getDay() !== $scope.dayOfTheWeek) {
            // Go to splash to fetch new texts
            $state.go('splash');
            // Apply since we are not in angular world
            $scope.$apply();
          }
        }
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
        // Send button clicked
        $scope.sendButtonClick = function() {
          // Pick send method
          $state.go('home.sendmethod');
        };
        // Send via SMS
        $scope.sendSMS = function() {
          // If we dont have a mobile number 
          if(!settings.mobileNumber || settings.mobileNumber==='') {
            // Go to mobile select
            $state.go('home.mobileselect');
          } else {
            // Send the SMS
            sendSMS.setMobileNumber(settings.mobileNumber);
            sendSMS.send(prepareContentForSending()).then(function() {
              // Report SMS send
              analytics.reportEvent('Text', $scope.currentText.text.TextId, 'TextSelect', 'smssend');
              // Go to success result
              $state.go('home.sendresult', {success: true});
            }, function() {
              // Report SMS send fail
              analytics.reportEvent('Text', $scope.currentText.text.TextId, 'TextSelect', 'smssendfail');
              // Go to fail result
              $state.go('home.sendresult', {success: false});
            }); 
          }
        };
        // Send via Email
        $scope.sendEmail = function() {
          // Translate the email subject
          $translate('EMAIL_SUBJECT_' + settings.emailSubjectIndex).then(function(emailSubject) {
            // Send the Email
            sendEmail.setEmailAddress(settings.emailAddress);
            sendEmail.setAttachmentPath($scope.currentImage);
            sendEmail.send(mumPetName.replace(emailSubject, settings.mumPetName), prepareContentForSending());
            // Report email send
            analytics.reportEvent('Text', $scope.currentText.text.TextId, 'TextSelect', 'emailsend');
          });
        };    
        // Send via Facebook
        $scope.sendFacebook = function() {
          // TODO: implement
          alert('sending "' + prepareContentForSending() + '" via Facebook');
        };
        // Settings button clicked
        $scope.settingsButtonClick = function() {
          $state.go('home.settings');
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
            $state.go('debug');
          }
        };
        // Returns true if the bottom bar should be visible
        $scope.bottomBarVisible = function() {
          return !$scope.textSlider.eof && !$scope.imageSlider.eof && !$scope.childStateActive();
        };
        // Returns true if a child state is active
        $scope.childStateActive = function() {
          return $state.current.name !== 'home';
        };
        // Initialise swipe hints
        function initSwipeHints() {
          // Every now and then
          $interval(function() {
            // If there are no child states active
            if(!$scope.childStateActive()) {
              // If image was not swiped 
              if(!$scope.imageWasSwiped) {
                // Show image swipe hint
                $scope.imageSwipeHintVisible = true;
              }
              // Wait a bit more
              $timeout(function() {
                // If text was not swiped 
                if(!$scope.textWasSwiped) {
                  // Show text swipe hint 
                  $scope.textSwipeHintVisible = true;
                }
              }, 3000);
            }
          }, 7000);
        }
        $scope.imageSwipeHintComplete = function() {
          $scope.imageSwipeHintVisible = false;
        };
        $scope.textSwipeHintComplete = function() {
          $scope.textSwipeHintVisible = false;
        };
        $scope.formatTextForDisplay = function(text) {
          if(!text) return;
          return text
            .replace(/\s\!/g, '&nbsp;!')
            .replace(/\s\?/g, '&nbsp;?')
            .replace(/\s\:/g, '&nbsp;:')
            .replace(/\s\»/g, '&nbsp;»');
        };
        // Prepare text content for sending 
        function prepareContentForSending() {
          // Get current text
          var text = $scope.textSlider.currentText.text;
          // Get current text content
          var content = text.Content;
          // Add of the day labels
          if($scope.textIsThought(text)) content = $translate.instant('OTD_THOUGHT') + ' - ' + content;
          if($scope.textIsJoke(text)) content = $translate.instant('OTD_JOKE') + ' - ' + content;
          // Add author if quote
          if($scope.textIsQuote(text)) {
            content += ' - ' + text.Author;
          }
          // Return prepared content
          return content;
        }
        // Replace mother pet names
        function replacePetNames(texts, replacement) {
          if(texts) {
            for(var i=0; i<texts.length; i++) {
              texts[i].text.Content = mumPetName.replace(texts[i].text.Content, replacement); 
            }
          }
        }
      }
    });
  });

  // Select (n) unique images
  // TODO: temporary, move
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

}());
