(function() {

  "use strict";

  angular.module('app/settings').controller('SettingsCtrl', function($window, $scope, config, notification) {
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
    // Watch notification toggle
    $scope.$watch('settings.notification', function(notificationEnabled) {
      if(notificationEnabled) {
        setNotification();
      } else {
        notification.clear();
      }
    });
    // Watch notificaton hour
    $scope.$watch('settings.notificationHour', function() {
      setNotification();
    });
    // Watch notificaton minute
    $scope.$watch('settings.notificationMinute', function() {
      setNotification();
    });
    // Update notification
    function setNotification() {
      if($scope.settings.notification) {
        notification.set($scope.settings.notificationHour, $scope.settings.notificationMinute, config.notificationMessage);
      }
    }
  });

}());
