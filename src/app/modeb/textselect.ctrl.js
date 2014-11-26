(function() {

  "use strict";

  angular.module('app/textselect').controller('TextSelectModeBCtrl', function($scope, $window, $document, $timeout, $cordovaPreferences, instructions, config, texts) {
    var textImageMap = {};
    var imageIndex = Math.floor(Math.random()*config.imageUrls.length);
    // TODO: remove once we pick from contacts (#12)
    $scope.emailAddress = $window.tempEmail;
    $scope.mobileNumber = $window.tempMobile;
    // Get device width and height
    // TODO: move into service
    $scope.deviceWidth = $window.deviceWidth;    
    $scope.deviceHeight = $window.deviceHeight;    
    // Calculate slide image height
    $scope.slideImageHeight = $scope.deviceHeight * 0.50;
    // Show instructions
    showInstructions();
    // Fetch text list
    texts.fetch(config.area, config.intentionSlug, config.recipientId, function(textList) {
      // Store text list
      $scope.textList = textList;
    });
    $scope.getNextText = function() {
      // Get a text
      var text = texts.suggest();
      // Associate image with text
      // TODO: we need the images on the server to add a link to the send text
      textImageMap[text.TextId] = config.imageUrls[imageIndex]; 
      // Increment image index
      imageIndex++;
      if(imageIndex > config.imageUrls.length-1) imageIndex = 0;
      // Return text
      return text;  
    };
    // Get the url of the image associated with the text
    $scope.getTextImageUrl = function(text) {
      if(!text) return null;
      return textImageMap[text.TextId]; 
    };
    $scope.indicatorClasses = {};
    $scope.dragLeft = function() {
      $scope.indicatorClasses['ion-close-round'] = true;
      $scope.indicatorClasses['ion-heart'] = false;
      $scope.indicatorClasses.center = false;
      $scope.indicatorClasses.animateSwipe = false;
    };
    $scope.dragRight = function() {
      $scope.indicatorClasses['ion-close-round'] = false;
      $scope.indicatorClasses['ion-heart'] = true;
      $scope.indicatorClasses.center = false;
      $scope.indicatorClasses.animateSwipe = false;
    };
    $scope.center = function() {
      $scope.indicatorClasses.center = true;
      $scope.indicatorClasses.animateSwipe = false;
    };
    $scope.swipeLeft = function() {
      $scope.indicatorClasses.animateSwipe = true;
    };
    $scope.swipeRight = function() {
      $scope.indicatorClasses.animateSwipe = true;
    };
    function showInstructions() {
      // TODO: having to add a class to body so we can style the popup instance.. see ionic issue: #1962
      var bodyElement = angular.element(document.getElementsByTagName('body')[0]); 
      bodyElement.addClass('popupTemp'); 
      $scope.$on('$destroy', function() {
        bodyElement.removeClass('popupTemp');
      });
      $timeout(function() {
        instructions.show($scope);
      }, 500);
    }
  });
}());
