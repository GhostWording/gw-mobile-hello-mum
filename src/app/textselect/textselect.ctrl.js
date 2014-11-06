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
      // Set current text to first
      // TODO: for now.. we need a text suggestion mechanism to randomise the suggestion
      $scope.currentText = $scope.texts[0];
    }); 
    // Send text via email
    // TODO: move to service
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
    // Send text via SMS
    // TODO: move to service
    $scope.sendViaSMS = function(text) {
      // TODO: get $cordovaPreferences to work
      // Send SMS
      if($window.tempMobile && $window.tempMobile !== '') {
        $cordovaSms.send($window.tempMobile, text.Content, '');
      }
      // Deselect text
      $scope.deselectText();
    };
    // Send text via Facebook
    // TODO: move to service
    $scope.sendViaFacebook = function(text) {
      alert('send "' + text.Content + '" via Facebook');
    };
  });

}());
