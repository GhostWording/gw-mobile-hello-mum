(function() {

  "use strict";

  angular.module('app/textselect').controller('TextSelectCtrl', function($scope, $window, $document, $cordovaSms, $cordovaPreferences, config, currentIntention, areasSvc, intentionsSvc, textsSvc, recipientTypesSvc, filteredTextListSvc, filtersSvc) {
    // Fetch text list from server and filter to mother recipient type
    function fetchTexts(done) {
      // Set area
      areasSvc.setCurrentName(config.area);
      // Set current intention
      intentionsSvc.setIntentionSlug(currentIntention); 
      // Get recipient types
      // TODO: show an error to the user if we couldn't fetch recipient types (#51)
      recipientTypesSvc.getRecipients().then(function(){
        // Get recipient type tag
        var recipientTypeTag = recipientTypesSvc.getThisOneNow(config.recipientId).RecipientTypeTag;
        // Fetch text list
        // TODO: show an error to the user if we couldn't fetch texts (#51)
        // TODO: handle localisation
        textsSvc.getCurrentTextList('en-EN').then(function(texts) {
          var user = {};
          // Set recipient type tag on filters service
          filtersSvc.setRecipientTypeTag(recipientTypeTag);
          // Get filters          
          var filters = filtersSvc.filters; 
          // Set up filtered text list service
          filteredTextListSvc.setFilteredAndOrderedList(texts, user, filters.preferredStyles);
          // filter texts
          var filteredTexts = filteredTextListSvc.getFilteredTextList();
          // Done
          done(filteredTexts);
        }); 
      });
    }
    // Suggest a text (random at the moment)
    // TODO: improve or use something from gw-common
    function suggestText() {
      // TODO: do something when the texts run out!
      if($scope.filteredTexts.length <= 2) return null;
      var currentText = $scope.slides[$scope.currentSlide].text;
      var suggestedText;
      do {
        var suggestedTextIndex = Math.floor(Math.random() * ($scope.filteredTexts.length-1));
        suggestedText = $scope.filteredTexts[suggestedTextIndex];
      } while(suggestedText == currentText);
      return suggestedText;
    }
    // Create a new slide
    var imageIndex = 0;
    function newSlide(text, zIndex) {
      var slide = {
        text: text,
        imageUrl: config.imageUrls[imageIndex],
        opacity: 1,
        zIndex: zIndex!==undefined?zIndex:0,
        swipeDirection: 'none'
      };
      imageIndex++;
      if(imageIndex > config.imageUrls.length-1) imageIndex = 0;
      return slide;
    }
    // Flip the two slides over
    function flipSlides() {
      $scope.currentSlide=$scope.currentSlide===0?1:0;
      $scope.otherSlide=$scope.otherSlide===0?1:0;
    }
    // Initialise slides
    var dragState = {};
    $scope.slides = [{},{}];
    $scope.currentSlide = 0;
    $scope.otherSlide = 1;
    $scope.windowWidth = $window.deviceWidth;    
    $scope.windowHeight = $window.deviceHeight;
    $scope.slideImageHeight = $scope.windowHeight * 0.50;
    $scope.navPosition = $scope.slideImageHeight + config.UI.navButtonVOffset;
    // Get current slide
    $scope.getCurrentSlide = function() {
      return $scope.slides[$scope.currentSlide];
    };
    // Temporary kitten image url's
    $scope.imageUrls = config.imageUrls;
    // Zero current text
    $scope.currentText = 0;
    // Fetch texts
    fetchTexts(function(texts) {
      // Store texts
      $scope.filteredTexts = texts;
      // Initialise slides with first two texts
      $scope.slides[$scope.currentSlide] = newSlide(suggestText(), 20);
      $scope.slides[$scope.otherSlide] = newSlide(suggestText());
    });
    // Like the current text
    $scope.like = function(text) {
      // Scroll current slide out to right
      $scope.slides[$scope.currentSlide].animation = 'slideAnimateOutRight';
      // Bring other slide forward
      $scope.slides[$scope.otherSlide].animation = 'slideAnimateBringIn';
      // Hide send bar
      $scope.sendBarVisible = false;
      // Flip slides
      flipSlides();
    };
    // Dislike the current text
    $scope.dislike = function(text) {
      console.assert($scope.filteredTexts.indexOf($scope.slides[$scope.currentSlide].text)!=-1);
      // Remove text from text list
      $scope.filteredTexts.splice($scope.filteredTexts.indexOf($scope.slides[$scope.currentSlide].text), 1);
      console.log($scope.filteredTexts.length);
      // Scroll current slide out to left
      $scope.slides[$scope.currentSlide].animation = 'slideAnimateOutLeft';
      // Bring other slide forward
      $scope.slides[$scope.otherSlide].animation = 'slideAnimateBringIn';
      // Hide send bar
      $scope.sendBarVisible = false;
      // Flip slides
      flipSlides();
    };
    // Like icon clicked
    $scope.likeIconClick = function() {
      delete dragState.offsetY;
      offsetSlide($scope.currentSlide, 0, 0);
      fadeSlide($scope.otherSlide, 0);
      $scope.like();
    };
    // Dislike icon clicked
    $scope.dislikeIconClick = function() {
      delete dragState.offsetY;
      offsetSlide($scope.currentSlide, 0, 0);
      fadeSlide($scope.otherSlide, 0);
      $scope.dislike();
    };
    // Send button clicked
    $scope.sendButtonClick = function() {
      $scope.sendBarVisible = true;
    };
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
    };
    // Send text via Facebook
    // TODO: move to service
    $scope.sendViaFacebook = function(text) {
      alert('send "' + text.Content + '" via Facebook');
    };
    // TODO: DOM manipulation in controller, this should be removed when we switch textselect to a directive
    var slideContainer = document.getElementsByClassName('slideContainer')[0];
    // Mobile touch start handler
    slideContainer.addEventListener('touchstart', function(e) {
      e.preventDefault();
      dragStart(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }, true);
    // Mobile touch move handler
    slideContainer.addEventListener('touchmove', function(e) {
      e.preventDefault();
      dragMove(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }, true);
    // Mobile touch end handler
    slideContainer.addEventListener('touchend', function(e) {
      e.preventDefault();
      dragEnd(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }, true);
    // Desktop drag listeners
    slideContainer.addEventListener('mousedown', function(e) {dragStart(e.x, e.y);}, true);
    slideContainer.addEventListener('mousemove', function(e) {dragMove(e.x, e.y);}, true);
    slideContainer.addEventListener('mouseup', function(e) {dragEnd(e.x, e.y);}, true);
    // Start dragging slide
    function dragStart(x,y) {
      dragState.dragging = true; 
      dragState.axis = null;
      dragState.startX = x;
      if(dragState.offsetY) {
        console.log(dragState.offsetY);
        dragState.startY = -dragState.offsetY + y;
      } else {
        dragState.startY = y;
      }
      offsetSlide($scope.currentSlide, 0, dragState.offsetY);
      fadeSlide($scope.currentSlide, 1);
      $scope.slides[$scope.currentSlide].animation = null; 
      $scope.slides[$scope.currentSlide].zIndex = 20;
      // Get a new other slide
      $scope.slides[$scope.otherSlide] = newSlide(suggestText());
      offsetSlide($scope.otherSlide, 0, 0);
      $scope.$apply();
    }
    // Dragging slide
    function dragMove(x,y) {
      if (!dragState.dragging) return;
      var currentSlide = $scope.slides[$scope.currentSlide];
      if(!dragState.axis) dragState.axis = (Math.abs(x-dragState.startX) > Math.abs(y-dragState.startY))?'x':'y';
      dragState.offsetX = 0;
      dragState.offsetY = 0;
      if(dragState.axis === 'x') {
        dragState.offsetX = x - dragState.startX; 
        fadeSlide($scope.otherSlide, Math.min(Math.abs(dragState.offsetX / $scope.windowWidth) + 0.1, 1));
        if(dragState.offsetX < 0 && currentSlide.swipeDirection !== 'left') {
          currentSlide.swipeDirection = 'left';
          $scope.$apply();
        }
        if(dragState.offsetX > 0 && currentSlide.swipeDirection !== 'right') {
          currentSlide.swipeDirection = 'right';
          $scope.$apply();
        }
      } else {
        var slideBottomElement = document.querySelector('.textSelect .slideBottom');
        var slideHeight = getSlideHeight($scope.currentSlide);
        var maxOffsetY = Math.max(slideHeight - $scope.windowHeight, 0);
        dragState.offsetY = Math.max(Math.min(y - dragState.startY, 0), -maxOffsetY);
        console.log(dragState.offsetY);
      }
      offsetSlide($scope.currentSlide, dragState.offsetX, dragState.offsetY);
    }
    // End dragging slide
    function dragEnd(x,y) {
      if(!dragState.dragging) return;
      var currentSlide = $scope.slides[$scope.currentSlide];
      // Clear dragging flag
      dragState.dragging = false;
      // If dragging sideways
      if(dragState.axis === 'x') {
        var dragDist = x - dragState.startX;
        var likeDontLikeDistanceThreshold = $scope.windowWidth / 6;
        // If like threshold reached
        if(dragDist > likeDontLikeDistanceThreshold) {
          // Like the text
          $scope.like();
        // If dislike threshold reached
        } else if(dragDist < -likeDontLikeDistanceThreshold) {
          // Dislike the text
          $scope.dislike();
        } else {
          // Animate back to center if like/dislike threshold not reached
          currentSlide.animation = 'slideAnimateToCenter';
          // Clear swipe direction
          currentSlide.swipeDirection = 'none';
        }
      }
      $scope.$apply();
    }
    function getSlideHeight(index) {
      var slideElement = document.getElementsByClassName('slideBottom')[index];
      return slideElement.offsetTop;
    }
    function offsetSlide(index, offsetX, offsetY) {
      var slideElement = document.getElementsByClassName('slide')[index];
      // Note: translate3d gives a smoother touchmove frequency on android for some reason
      var translation = 'translate3d(' + offsetX + 'px,' + offsetY +'px, 0)';
      slideElement.style.webkitTransform = translation;
      slideElement.style.transform = translation;
    }
    function fadeSlide(index, opacity) {
      var slideElement = document.getElementsByClassName('slide')[index];
      slideElement.style.opacity = opacity;
    }
  });
}());
