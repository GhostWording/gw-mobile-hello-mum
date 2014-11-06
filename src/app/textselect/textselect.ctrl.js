(function() {

  "use strict";

  angular.module('app/textselect').controller('TextSelectCtrl', 
    function($scope, $window, $cordovaSms, $cordovaPreferences, config, currentIntention, areasSvc, intentionsSvc, textsSvc, filteredTextListSvc, filtersSvc) {
    // set area
    areasSvc.setCurrentName(config.area);
    // Set current intention
    intentionsSvc.setIntentionSlug(currentIntention); 
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
    $scope.selectText = function(text) {
      $scope.selectedText = text;
    };
    // Deselect currently selected text
    $scope.deselectText = function() {
      $scope.selectedText = null;
    };
    // Returns true if the passed text is the currently selected text
    $scope.textSelected = function(text) {
      return (text == $scope.selectedText); 
    };
    $scope.sendViaEmail = function(text) {
      // TODO: get $cordovaPreferences to work
      if($window.tempEmail && $window.tempEmail !== '') {
        cordova.plugins.email.open({
          to:      $window.tempEmail,
          subject: 'Hello Mum',
          body:    text.Content 
        });
      }
    };
    $scope.sendViaSMS = function(text) {
      // TODO: get $cordovaPreferences to work
      // Send SMS
      if($window.tempMobile && $window.tempMobile !== '') {
        $cordovaSms.send($window.tempMobile, text.Content, '');
      }
      // Deselect text
      $scope.deselectText();
    };
    $scope.sendViaFacebook = function(text) {
      alert('send "' + text.Content + '" via Facebook');
    };
  });
}());
