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
    // Navigation
    $scope.previousStarredText = function() {
      $scope.slides[$scope.otherSlide] = newSlide(suggestText());
      $scope.slides[$scope.otherSlide].animation = 'slideAnimateInRight';
      $scope.slides[$scope.currentSlide].animation = 'slideAnimateOutRight';
      flipSlides();
    };
    $scope.nextText = function() {
      $scope.slides[$scope.otherSlide] = newSlide(suggestText());
      $scope.slides[$scope.otherSlide].animation = 'slideAnimateInLeft';
      $scope.slides[$scope.currentSlide].animation = 'slideAnimateOutLeft';
      flipSlides();
    };
    // Starring
    // TODO: move into service?
    $scope.starredTexts = [];
    $scope.starText = function() {
      // Add current slide text to starred texts
      $scope.starredTexts.push($scope.slides[$scope.currentSlide].text);
      // Move on to next text
      $scope.nextText();
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
  })

}());
