(function() {

  "use strict";

  angular.module('app')
    .run(function(
      /* ANG */ $document,
      /* 3RD */ $ionicPlatform, $translate, 
      /* GMC */ config, settings, notification, localisation, mImages,
      /* APP */ petName) {
      $ionicPlatform.ready(function() {
        // If pet name hasn't been chosen, use the first in the list
        if(settings.petName === undefined) settings.petName = config.text.petNames[0];
        // If notification enabled
        if(settings.notification) {
          // Set notification
          $translate('NOTIFICATION').then(function (notificationText) {
            notification.set(settings.notificationHour, settings.notificationMinute, petName.replace(notificationText, settings.petName));
          });
        } else {
          // Clear notification
          notification.clear();
        }
        // On app return to foreground
        $document.bind("resume", function() {
          // Fetch a few more remote images into local containers (round robin)
          mImages.fetchFromEachContainer(config.image.containerPaths, config.image.fetchPerDay);
        });
        // If the language changes, re-show the welcome texts
        localisation.onLanguageChange(function() {
          settings.welcomeTextShownTimes = 0;
        });
      });
  });

}());
