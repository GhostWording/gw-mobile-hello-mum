(function() {

  "use strict";

  angular.module('app')
    .run(function(
      /* 3RD */ $ionicPlatform, $translate, 
      /* GMC */ config, settings, notification,
      /* APP */ mumPetName) {
      $ionicPlatform.ready(function() {
        // Set notification
        if(settings.notification) {
          $translate('NOTIFICATION').then(function (notificationText) {
            notification.set(settings.notificationHour, settings.notificationMinute, mumPetName.replace(notificationText, settings.mumPetName));
          });
        } else {
          notification.clear();
        }
      });
  });

}());
