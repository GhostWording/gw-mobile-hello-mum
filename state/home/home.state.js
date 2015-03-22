(function() {

  "use strict";

  angular.module('state/home').config(function($stateProvider) {
    $stateProvider.state('home', {
      url: '/home',
      templateUrl: 'state/home/home.part.html',
      resolve: {
        images: function($http, config, mImages) {
          return mImages.chooseFromRandomContainer(config.image.containerPaths, config.image.containerWeights, config.image.choosePerDay).catch(function(error) {
            alert('failed to choose images: ' + error);
            return [];
          });
        },
        texts: function($rootScope, $q, $timeout, texts, config) {
          // Fetch texts (with retry)
          return texts.fetch().then(function() {
            // Pick (n) texts
            return texts.choose(config.text.choosePerDay); 
          });
        }
      },
      controller: function(
        /* ANG */ $scope, $window, $timeout, $interval, 
        /* 3RD */ $state, $ionicScrollDelegate, $translate, 
        /* GMC */ config, settings, analytics, localisation, sendSMS, sendEmail,
        /* GWC */ helperSvc, 
        /* APP */ petName, 
        /* RES */ images, texts) {
        // Report home page init
        analytics.reportEvent('Init', 'Page', 'Home', 'Init');
        // Get device width and height
        // TODO: move into service
        $scope.deviceWidth = $window.deviceWidth;    
        $scope.deviceHeight = $window.deviceHeight;    
        // Calculate slide image height
        $scope.slideImageHeight = $scope.deviceHeight * config.image.heightFactor;
        // Put config on the scope
        $scope.config = config;
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
        $scope.textSliderSwiped = function() {
          // Scroll back to top
          $ionicScrollDelegate.scrollTop(true); 
          // Disable text swipe hints
          settings.textSliderSwiped = true;
          // Report Text Swipe
          analytics.reportEvent('Text', $scope.textSlider.currentText.text.TextId, 'Home', 'Swipe'); 
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
          replacePetNames($scope.texts, settings.petName);
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
        };
        // Send via Email
        $scope.sendEmail = function() {
          // Translate the email subject
          $translate('EMAIL_SUBJECT_' + settings.emailSubjectIndex).then(function(emailSubject) {
            // Send the Email
            sendEmail.setEmailAddress(settings.emailAddress);
            sendEmail.setAttachmentPath($scope.currentImage);
            sendEmail.send(petName.replace(emailSubject, settings.petName), prepareContentForSending());
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
        // Replace pet names
        function replacePetNames(texts, replacement) {
          if(texts) {
            for(var i=0; i<texts.length; i++) {
              texts[i].text.Content = petName.replace(texts[i].text.Content, replacement); 
            }
          }
        }
      }
    });
  });

}());
