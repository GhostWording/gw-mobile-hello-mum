(function() {

  "use strict";

  angular.module('state/home').config(function($stateProvider) {
    $stateProvider.state('home', {
      url: '/home',
      templateUrl: 'state/home/home.part.html',
      resolve: {
        // Choose images (they will be injected as "chosenImages" in the controller below)
        chosenImages: function($http, config, images) {
          // Choose images
          return images.chooseFromRandomContainer(config.image.containerPaths, config.image.containerWeights, config.image.showPerDay).catch(function(error) {
            // TODO: remove, just added for the clone test (because it will happen!)
            alert('failed to choose images: ' + error);
            return [];
          });
        },
        // Fetch and choose texts (they will be injected as "chosenTexts" in the controller below)
        chosenTexts: function(texts, config, settings, loading, localisation) {
          // Show the loading overlay and retry text fetch if no connectivity
          return loading.showAndRetry(config.text.fetchRetryDelay, function() {
            // If welcome texts not shown enough times (and language not spanish)
            if(settings.welcomeTextShownTimes < config.text.welcomeTextShowTimes && localisation.getLanguage() !== 'es') {
              // Fetch welcome texts
              return texts.fetchWelcome().then(function(fetchedTexts) {
                // Increment welcome text shown count
                settings.welcomeTextShownTimes ++;
                // Fetch all texts in the background
                texts.fetchAll();
                // Choose welcome texts
                return texts.chooseWelcome(fetchedTexts, config.text.showPerDay);
              });
            } else {
              // Fetch all texts
              return texts.fetchAll().then(function(fetchedTextLists) {
                // Choose texts
                return texts.chooseAll(fetchedTextLists, config.text.showPerDay);
              });
            }
          });
        }
      },
      controller: function(
        /* ANG */ $scope, $window, $timeout, $interval, 
        /* 3RD */ $state, $ionicScrollDelegate, $translate, 
        /* GMC */ config, settings, analytics, localisation, sendSMS, sendEmail, sendFacebook, images,
        /* GWC */ helperSvc, 
        /* APP */ petName, 
        /* RES */ chosenImages, chosenTexts) {
        // Report home page init
        analytics.reportEvent('Init', 'Page', 'Home', 'Init');
        // Get device width and height
        // TODO: move into service
        $scope.deviceWidth = $window.deviceWidth;    
        $scope.deviceHeight = $window.deviceHeight;    
        // Calculate slide image height
        $scope.slideImageHeight = $scope.deviceHeight * config.image.heightFactor;
        // Put config service on the scope
        $scope.config = config;
        // Put settings service on the scope
        $scope.settings = settings;
        // Put chosen images on the scope
        $scope.chosenImages = chosenImages;
        // Put chosen texts on the scope
        $scope.chosenTexts = chosenTexts;
        // Get day of the week
        $scope.dayOfTheWeek = (new Date()).getDay();
        // Slider states
        $scope.textSlider = {};
        $scope.imageSlider = {};
        $scope.textSliderSwiped = function() {
          // Scroll back to top
          $ionicScrollDelegate.scrollTop(true); 
          // Disable text swipe hints
          settings.textSliderSwiped = true;
          // Report Text Swipe
          analytics.reportEvent('Text', $scope.textSlider.currentText.TextId, 'Home', 'Swipe'); 
        };
        // Image slide swiped
        $scope.imageSliderSwiped = function() {
          // Disable image swipe hints
          settings.imageSliderSwiped = true;
          // Report Image Swipe
          analytics.reportEvent('Photo', $scope.imageSlider.currentImage, 'Home', 'Swipe'); 
        };
        // Watch pet name setting, and re-replace on change
        $scope.$watch('settings.petName', function() {
          replacePetNames($scope.chosenTexts, settings.petName);
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
          // See if text is appropriate for facebook
          var text = $scope.textSlider.currentText;
          var appropriateForFacebook = 
            $scope.textIsQuote(text) ||
            $scope.textIsThought(text) ||
            $scope.textIsJoke(text);
          // Pick send method
          $state.go('home.sendmethod', {smsEnabled: true, emailEnabled: true, facebookEnabled: appropriateForFacebook});
        };
        // Get a local image url from an image path
        $scope.getImageLocalUrl = function(imagePath) {
          if(!imagePath) return;
          return images.getImageLocalUrl(imagePath);
        };
        // Send via SMS
        $scope.sendSMS = function() {
          // Send the SMS
          sendSMS.setMobileNumber(settings.mobileNumber);
          sendSMS.send(prepareContentForSending()).then(function() {
            // Report SMS send
            analytics.reportEvent('Text', $scope.textSlider.currentText.TextId, 'TextSelect', 'smssend');
            // Go to success result
            $state.go('home.sendresult', {success: true});
          }, function() {
            // Report SMS send fail
            analytics.reportEvent('Text', $scope.textSlider.currentText.TextId, 'TextSelect', 'smssendfail');
            // Go to fail result
            $state.go('home.sendresult', {success: false});
          }); 
        };
        // Send via Email
        $scope.sendEmail = function() {
          // Translate the email subject
          $translate('EMAIL_SUBJECT_' + settings.emailSubjectIndex).then(function(emailSubject) {
            // Send the Email
            sendEmail.setEmailAddress(settings.emailAddress);
            sendEmail.setAttachmentPath(images.getImageDevicePath($scope.imageSlider.currentImage));
            sendEmail.send(petName.replace(emailSubject, settings.petName), prepareContentForSending());
            // Report email send
            analytics.reportEvent('Text', $scope.textSlider.currentText.TextId, 'TextSelect', 'emailsend');
          });
        };    
        // Send via Facebook
        $scope.sendFacebook = function() {
          sendFacebook.send(
            prepareContentForSending(), 
            images.getImageRemoteUrl($scope.imageSlider.currentImage), 
            config.send.facebook.caption, 
            config.send.facebook.description, 
            config.send.facebook.useDialog).then(function(response) {
            // Report facebook send success
            analytics.reportEvent('Text', $scope.textSlider.currentText.TextId, 'TextSelect', 'facebooksend');
            // Go to success result
            $state.go('home.sendresult', {success: true});
          }, function(error) {
            // Go to error result
            $state.go('home.sendresult', {success: false});
            // TODO: add analytic
          });
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
          var text = $scope.textSlider.currentText;
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
        // Replace pet names
        function replacePetNames(texts, replacement) {
          if(texts) {
            for(var i=0; i<texts.length; i++) {
              texts[i].Content = petName.replace(texts[i].Content, replacement); 
            }
          }
        }
      }
    });
  });

}());
