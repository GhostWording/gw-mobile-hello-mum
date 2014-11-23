(function() {

  "use strict";

  angular.module('app/textselect').controller('TextSelectCtrl', function($scope, $window, $document, $cordovaPreferences, sendSMS, sendEmail, sendFacebook, config, texts) {
    $scope.swipeDirection = 'none';
    // TODO: remove once we pick from contacts (#12)
    $scope.emailAddress = $window.tempEmail;
    $scope.mobileNumber = $window.tempMobile;
    // Create a new slide
    var imageIndex = 0;
    function newSlide(text, zIndex) {
      var slide = {
        text: text,
        imageUrl: config.imageUrls[imageIndex],
        opacity: 1,
        zIndex: zIndex!==undefined?zIndex:0
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
    texts.fetch(config.area, config.intentionSlug, config.recipientId, function(textList) {
      // Store text list
      $scope.textList = textList;
      // Initialise slides with first two texts
      $scope.slides[$scope.currentSlide] = newSlide(texts.suggest(), 20);
      $scope.slides[$scope.otherSlide] = newSlide(texts.suggest());
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
      console.assert($scope.textList.indexOf($scope.slides[$scope.currentSlide].text)!=-1);
      // Remove text from text list
      $scope.textList.splice($scope.textList.indexOf($scope.slides[$scope.currentSlide].text), 1);
      // Scroll current slide out to left
      $scope.slides[$scope.currentSlide].animation = 'slideAnimateOutLeft';
      // Bring other slide forward
      $scope.slides[$scope.otherSlide].animation = 'slideAnimateBringIn';
      // Hide send bar
      $scope.sendBarVisible = false;
      // Flip slides
      flipSlides();
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
        dragState.startY = -dragState.offsetY + y;
      } else {
        dragState.startY = y;
      }
      offsetSlide($scope.currentSlide, 0, dragState.offsetY);
      fadeSlide($scope.currentSlide, 1);
      $scope.slides[$scope.currentSlide].animation = null; 
      $scope.slides[$scope.currentSlide].zIndex = 20;
      // Get a new other slide
      $scope.slides[$scope.otherSlide] = newSlide(texts.suggest($scope.slides[$scope.currentSlide].text));
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
        if(dragState.offsetX < 0 && $scope.swipeDirection !== 'left') {
          $scope.swipeDirection = 'left';
          $scope.$apply();
        }
        if(dragState.offsetX > 0 && $scope.swipeDirection !== 'right') {
          $scope.swipeDirection = 'right';
          $scope.$apply();
        }
      } else {
        var slideBottomElement = document.querySelector('.textSelect .slideBottom');
        var slideHeight = getSlideHeight($scope.currentSlide);
        var maxOffsetY = Math.max(slideHeight - $scope.windowHeight, 0);
        dragState.offsetY = Math.max(Math.min(y - dragState.startY, 0), -maxOffsetY);
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
          $scope.swipeDirection = 'none';
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
