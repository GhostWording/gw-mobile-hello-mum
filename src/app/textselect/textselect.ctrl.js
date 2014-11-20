(function() {

  "use strict";

  angular.module('app/textselect').controller('TextSelectCtrl', 
    function($scope, $window, $document, $cordovaSms, $cordovaPreferences, config, currentIntention, areasSvc, intentionsSvc, textsSvc, filteredTextListSvc, filtersSvc) {
    var dragState = {};
    // Suggest a text (random at the moment)
    // TODO: improve or use something from gw-common
    function suggestText() {
      var suggestedTextIndex = Math.floor(Math.random() * ($scope.filteredTexts.length-1));
      return $scope.filteredTexts[suggestedTextIndex]; 
    }
    // Initialise slides
    $scope.slides = [{},{}];
    $scope.currentSlide = 0;
    $scope.otherSlide = 1;
    // Create a new slide
    function newSlide(text, zIndex) {
      return {
        text: text,
        imageUrl: config.imageUrls[Math.floor(Math.random() * (config.imageUrls.length-1))],
        opacity: 1,
        zIndex: zIndex!==undefined?zIndex:0
      };
    }
    // Flip the two slides over
    function flipSlides() {
      $scope.currentSlide=$scope.currentSlide===0?1:0;
      $scope.otherSlide=$scope.otherSlide===0?1:0;
    }
    // Layout slides
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
    // Set area
    areasSvc.setCurrentName(config.area);
    // Set current intention
    intentionsSvc.setIntentionSlug(currentIntention); 
    // Fetch texts
    textsSvc.getCurrentTextList('en-EN').then(function(texts) {
      $scope.texts = texts;
      // TODO: filtering and implement issue #33
      $scope.filteredTexts = texts.slice(0, 10);
      $scope.slides[$scope.currentSlide] = newSlide(suggestText(), 20);
      $scope.slides[$scope.otherSlide] = newSlide(suggestText());
    }); 
    $scope.like = function() {
      // Scroll current slide out to right
      $scope.slides[$scope.currentSlide].animation = 'slideAnimateOutRight';
      // Bring other slide forward
      $scope.slides[$scope.otherSlide].animation = 'slideAnimateBringIn';
      // Hide send bar
      $scope.sendBarVisible = false;
      // Flip slides
      flipSlides();
    };
    $scope.dislike = function() {
      // Scroll current slide out to left
      $scope.slides[$scope.currentSlide].animation = 'slideAnimateOutLeft';
      // Bring other slide forward
      $scope.slides[$scope.otherSlide].animation = 'slideAnimateBringIn';
      // Hide send bar
      $scope.sendBarVisible = false;
      // Flip slides
      flipSlides();
    };
    $scope.likeIconClick = function() {
      delete dragState.offsetY;
      offsetSlide($scope.currentSlide, 0, 0);
      fadeSlide($scope.otherSlide, 0);
      $scope.like();
    };
    $scope.dislikeIconClick = function() {
      delete dragState.offsetY;
      offsetSlide($scope.currentSlide, 0, 0);
      fadeSlide($scope.otherSlide, 0);
      $scope.dislike();
    };
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
      if(!dragState.axis) dragState.axis = (Math.abs(x-dragState.startX) > Math.abs(y-dragState.startY))?'x':'y';
      dragState.offsetX = 0;
      dragState.offsetY = 0;
      if(dragState.axis === 'x') {
        dragState.offsetX = x - dragState.startX; 
        fadeSlide($scope.otherSlide, Math.min(Math.abs(dragState.offsetX / $scope.windowWidth) + 0.1, 1));
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
          $scope.slides[$scope.currentSlide].animation = 'slideAnimateToCenter';
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
