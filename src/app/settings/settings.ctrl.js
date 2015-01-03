(function() {

  "use strict";

  angular.module('app/settings').controller('SettingsCtrl', function($window, $scope, config, notification, analytics) {
    // Get device width and height
    // TODO: move into service
    $scope.deviceWidth = $window.deviceWidth;    
    $scope.deviceHeight = $window.deviceHeight;    
    // Intentions
    $scope.intentions = [
      {name: 'how-are-you', label:'How Are You'},
      {name: 'I-think-of-you', label:'Thinking Of You'},
      {name: 'jokes', label:'Jokes'},
      {name: 'thank-you', label:'Thank You'},
      {name: 'a-few-words-for-you', label:'A Few Words For You'},
      {name: 'I-love-you', label:'I Love You'},
      {name: 'I-miss-you', label:'I Miss You'},
      {name: 'I-am-here-for-you', label:'Here For You'},
      {name: 'facebook-status', label:'Facebook Status'},
      {name: 'positive-thoughts', label:'Poisitive Thoughts'},
      {name: 'would-you-care-for-a-drink', label:'Care For A Drink?'}
    ];
    $scope.intentionWeightChange = function(intention) {
      // Report intention weight change
      analytics.reportEvent('Command', intention.name, 'Settings', 'click', $scope.settings[intention.name]);        
    };
    $scope.notificationChange = function() {
      if($scope.settings.notification) {
        // Report notification time
        analytics.reportEvent('Command', 'NotificationTime', 'Settings', 'click', $scope.settings.notificationHour + ":" + $scope.settings.notificationMinute);        
        // Set notification 
        notification.set($scope.settings.notificationHour, $scope.settings.notificationMinute, config.notificationMessage);
      } else {
        // Report notification disabled
        analytics.reportEvent('Command', 'NotificationDisabled', 'Settings', 'click');        
        // Clear notification
        notification.clear();
      }
    };
  });

}());
