(function() {

  "use strict";

  angular.module('app')
    .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('splash', {
          url: '/',
          templateUrl: 'app/splash/splash.part.html',
          controller: 'SplashCtrl'
        })
        .state('home', {
          url: '/home',
          templateUrl: 'app/home/home.part.html',
          controller: 'HomeCtrl'
        })
        .state('settings', {
          url: '/settings',
          templateUrl: 'app/settings/settings.part.html',
          controller: 'SettingsCtrl'
        })
        .state('home.send', {
          url: '/send',
          templateUrl: 'app/send/send.part.html',
          controller: 'SendCtrl' 
        })
        .state('home.sendresult', {
          templateUrl: 'app/sendresult/sendresult.part.html',
          controller: 'SendResultCtrl', 
          params: ['success']
        })
        .state('debug', {
          url: '/debug',
          templateUrl: 'app/debug/debug.part.html'
        });
    })
    .run(function($window, $ionicPlatform, $state, $cordovaDevice, $translate, config, settings, notification, analytics, localisation, mumPetName) {
      $ionicPlatform.ready(function() {
        // Localise!
        localisation.localise(settings.language);
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
        // Hide accessory bar
        //if(window.cordova && window.cordova.plugins.Keyboard) {
        //  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        //}
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
        // Set up default settings
        // TODO: move this into settings
        if(settings.notification === undefined) settings.notification = true;
        if(settings.notificationHour === undefined) settings.notificationHour = config.defaultNotificationHour;
        if(settings.notificationminute === undefined) settings.notificationMinute = config.defaultNotificationMinute;
        if(settings.mumPetName === undefined) settings.mumPetName = 'Mum';
        if(settings.emailSubjectIndex === undefined) settings.emailSubjectIndex = 0;
        settings.save();
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
