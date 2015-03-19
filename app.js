(function() {

  "use strict";

  angular.module('app')
    .run(function(
      /* 3RD */ $ionicPlatform, $translate, 
      /* GMC */ config, settings, notification,
      /* APP */ petName) {
      $ionicPlatform.ready(function() {
        // Set notification
        if(settings.notification) {
          $translate('NOTIFICATION').then(function (notificationText) {
            notification.set(settings.notificationHour, settings.notificationMinute, petName.replace(notificationText, settings.petName));
          });
        } else {
          notification.clear();
        }
      });
  });

}());
