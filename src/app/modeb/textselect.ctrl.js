(function() {

  "use strict";

  angular.module('app/textselect').controller('TextSelectModeBCtrl', function($scope, $window, $document, $timeout, $cordovaPreferences, instructions, settings, config, texts) {
    var textImageMap = {};
    var imageIndex = Math.floor(Math.random()*config.imageUrls.length);
    // TODO: remove once we pick from contacts (#12)
    $scope.emailAddress = settings.emailAddress;
    $scope.mobileNumber = settings.mobileNumber;
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
    $scope.likeIconClick = function() {
      alert('like');
    };
    $scope.dislikeIconClick = function() {
      alert('dislike');
    };
    $scope.indicatorClasses = {};
    $scope.draggedLeft = function() {
      $scope.indicatorClasses['ion-close-round'] = true;
      $scope.indicatorClasses['ion-heart'] = false;
      $scope.indicatorClasses.center = false;
      $scope.indicatorClasses.animateSwipe = false;
    };
    $scope.draggedRight = function() {
      $scope.indicatorClasses['ion-close-round'] = false;
      $scope.indicatorClasses['ion-heart'] = true;
      $scope.indicatorClasses.center = false;
      $scope.indicatorClasses.animateSwipe = false;
    };
    $scope.centered = function() {
      $scope.indicatorClasses.center = true;
      $scope.indicatorClasses.animateSwipe = false;
    };
    $scope.swipedLeft = function() {
      $scope.indicatorClasses.animateSwipe = true;
    };
    $scope.swipedRight = function() {
      $scope.indicatorClasses.animateSwipe = true;
    };
    function showInstructions() {
      $timeout(function() {
        instructions.show($scope);
      }, 700);
    }
  });
}());
