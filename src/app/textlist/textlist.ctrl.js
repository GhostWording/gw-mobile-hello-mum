(function() {

  "use strict";

  angular.module('app/textlist').controller('TextListCtrl', 
    function($scope, $window, $cordovaPreferences, config, areasSvc, intentionsSvc, textsSvc, filteredTextListSvc, filtersSvc) {
    // set area
    areasSvc.setCurrentName(config.area);
    // Set current intention
    intentionsSvc.setIntentionSlug(config.intentionSlug); 
    // Fetch texts
    textsSvc.getCurrentTextList('en-EN').then(function(texts) {
      $scope.texts = texts;
      $scope.filteredTexts = texts;
    }); 
    // Texts Ready
    $scope.textsReady = function() {
      return $scope.texts && $scope.texts.length > 0;
    };
    // User selects a text
    $scope.textTouched = function(text) {
      $scope.currentText = text;
    };
    // Returns true if the passed text is the currently selected text
    $scope.isCurrent = function(text) {
      return text == $scope.currentText; 
    };
    $scope.sendViaEmail = function(text) {
      // TODO: get $cordovaPreferences to work
      alert('send "' + text.Content + '" via email to address ' + $window.tempEmail);
    };
    $scope.sendViaSMS = function(text) {
      // TODO: get $cordovaPreferences to work
      alert('send "' + text.Content + '" via SMS to number ' + $window.tempMobile);
    };
    $scope.sendViaFacebook = function(text) {
      alert('send "' + text.Content + '" via Facebook');
    };
  });

}());
