(function() {

  "use strict";

  angular.module('app')
    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
      $ionicConfigProvider.platform.android.tabs.position("bottom");
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('splash', {
          url: '/',
          templateUrl: 'app/splash/splash.part.html'
        })
        .state('genderselect', {
          url: '/genderselect',
          templateUrl: 'app/genderselect/genderselect.part.html'
        })
        .state('textselect', {
          url: '/textselect',
          templateUrl: 'app/textselect/textselect.part.html'
        })
        .state('debug', {
          url: '/debug',
          templateUrl: 'app/debug/debug.part.html'
        });
    })
    .run(function($window, $ionicPlatform, $cordovaDevice, $translate, config, settings, notification, analytics, localisation, mumPetName) {
      $ionicPlatform.ready(function() {
        // Set up analytics
        analytics.setArea('HelloMum');
        // TODO: set from gw-mobile-common localise service
        //analytics.setLanguage('fr');
        analytics.setRecipientId('Mother');
        // If we are on a device (not browser)
        if($window.device) {
          // Set the device ID
          analytics.setDeviceId($cordovaDevice.getUUID());
          // Initialise google analytics
          analytics.initGoogleAnalytics(config.googleAnalyticsTrackerId, config.googleAnalyticsDebugMode);
          // Initialise server analytics
          analytics.initServerAnalytics();
        }
        // Report app start up
        analytics.reportEvent('Init', 'Init', 'App', 'Init');        
        // Localise!
        localisation.localise();
        // Hide accessory bar
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
        // Set settings template
        settings.setTemplateUrl('app/settings/settings.part.html');
        // Set up default settings
        // TODO: move this into settings
        if(settings.notification === undefined) settings.notification = true;
        if(settings.notificationHour === undefined) settings.notificationHour = config.defaultNotificationHour;
        if(settings.notificationminute === undefined) settings.notificationMinute = config.defaultNotificationMinute;
        if(settings.mumPetName === undefined) settings.mumPetName = 'Mum';
        if(settings.emailSubjectIndex === undefined) settings.emailSubjectIndex = 0;
        settings.save();
        console.log(settings);
        // Get device width and height
        // TODO: move into device service
        var windowElement = angular.element($window);
        $window.deviceWidth = windowElement[0].innerWidth;
        $window.deviceHeight = windowElement[0].innerHeight;
        // Set up default notification
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
