(function() {

  "use strict";

  angular.module('app/textselect').controller('TextSelectCtrl', 
    function($scope, $window, $document, $interval, $cordovaSms, $cordovaPreferences, config, currentIntention, areasSvc, intentionsSvc, textsSvc, filteredTextListSvc, filtersSvc) {
    // Suggest a text (random at the moment)
    // TODO: improve, or use something from gw-common
    function suggestText() {
      var suggestedTextIndex = Math.floor(Math.random() * ($scope.filteredTexts.length-1));
      return $scope.filteredTexts[suggestedTextIndex]; 
    }
    // Initialise slides
    $scope.slides = [{},{}];
    $scope.currentSlide = 0;
    $scope.otherSlide = 1;
    // Create a new slide
    function newSlide(text) {
      return {
        text: text,
        imageUrl: config.imageUrls[0]
      };
    }
    // Flip the two slides over
    function flipSlides() {
      $scope.currentSlide=$scope.currentSlide===0?1:0;
      $scope.otherSlide=$scope.otherSlide===0?1:0;
    }
    // Layout slides
    var windowElement = angular.element($window);
    $scope.windowWidth = windowElement[0].innerWidth;
    $scope.windowHeight = windowElement[0].innerHeight;
    $scope.slideImageHeight = $scope.windowHeight * 0.5;
    // Handle swiping
    $scope.mouseDown = function() {
      $scope.dragging = true;
    };
    $scope.mouseUp = function() {
      $scope.dragging = false;
    };
    $scope.mouseMove = function(event) {
      if($scope.dragging) {
      }
    };
    // Get current slide
    $scope.getCurrentSlide = function() {
      return $scope.slides[$scope.currentSlide];
    };
    // Move to next slide
    $scope.nextSlide = function() {
      var currentSlide = $scope.getCurrentSlide();
      if($scope.starredSlideIndex !== null && $scope.starredSlideIndex < $scope.starredSlides.length-1) {
        // Move to next starred slide
        $scope.starredSlideIndex++;
        $scope.slides[$scope.otherSlide] = $scope.starredSlides[$scope.starredSlideIndex];
      } else {
        // Move to new slide
        $scope.slides[$scope.otherSlide] = newSlide(suggestText());
        $scope.starredSlideIndex = null;
      }
      $scope.slides[$scope.otherSlide].animation = 'slideAnimateInLeft';
      $scope.slides[$scope.currentSlide].animation = 'slideAnimateOutLeft';
      flipSlides();
    };
    // TODO: move into service?
    $scope.starredSlides = [];
    $scope.starredSlideIndex = null;
    // Star the current slide
    $scope.toggleSlideStar = function() {
      var currentSlide = $scope.slides[$scope.currentSlide];
      // If not starred
      if(!currentSlide.starred) {
        // Mark slide as starred
        currentSlide.starred = true;
        // Add current slide to starred slides
        $scope.starredSlides.push(currentSlide);
        // Set the starred slide index to the end of the starred list
        $scope.starredSlideIndex = $scope.starredSlides.length-1;
      } else {
        // Clear the star
        currentSlide.starred = false;
        // Remove current slide from starred slides
        $scope.starredSlides.splice($scope.starredSlideIndex, 1);
      }
    };
    // Check if there is a previous starred slide
    $scope.previousStarredSlideExists = function() {
      return $scope.starredSlides.length > 0 && ($scope.starredSlideIndex === null || $scope.starredSlideIndex > 0);
    };
    // Go to previous starred slide
    $scope.previousStarredSlide = function() {
      var currentSlide = $scope.getCurrentSlide();
      // If we are going from a non starred slide to a starred slide
      if(!currentSlide.starred) {
        // Set the starred slide index to the end of the starred list
        $scope.starredSlideIndex = $scope.starredSlides.length-1;
      } else {
        // Otherwise decrement the starred slide index
        $scope.starredSlideIndex--;
      }
      $scope.slides[$scope.otherSlide] = $scope.starredSlides[$scope.starredSlideIndex];
      $scope.slides[$scope.otherSlide].animation = 'slideAnimateInRight';
      $scope.slides[$scope.currentSlide].animation = 'slideAnimateOutRight';
      flipSlides();
    };
    // Temporary kitten image url's
    $scope.imageUrls = config.imageUrls;
    console.log($scope.imageUrls);
    // Zero current text
    $scope.currentText = 0;
    // Set area
    areasSvc.setCurrentName(config.area);
    // Set current intention
    intentionsSvc.setIntentionSlug(currentIntention); 
    // Fetch texts
    textsSvc.getCurrentTextList('en-EN').then(function(texts) {
      $scope.texts = texts;
      // TODO: filtering and implement issue #33
      $scope.filteredTexts = texts.slice(0, 10);
      console.log($scope.filteredTexts);
      $scope.slides[$scope.currentSlide] = newSlide(suggestText());
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
    // Change background color on text change
    $scope.$watch('currentText', function(currentText) {
      if(currentText === undefined) currentText = 0;
      document.body.style.background = '#' + config.backgroundColours[currentText % $scope.imageUrls.length];
    });
    //  Get current text, based on text slider index
    $scope.getCurrentText = function() {
      return $scope.filteredTexts[$scope.currentText?$scope.currentText:0];
    };
    // Get current image url, based on image slider index
    $scope.getCurrentImageUrl = function() {
      return $scope.imageUrls[$scope.currentImage?$scope.currentImage:0];
    };
  });

}());
