(function() {

  "use strict";

  angular.module('app')
    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
      $ionicConfigProvider.platform.android.tabs.position("bottom");
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'app/home/home.part.html'
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
    .run(function($window, $ionicPlatform, $cordovaDevice, config, settings, notification, analytics) {
      $ionicPlatform.ready(function() {
        // Set up analytics
        analytics.setArea('HelloMum');
        analytics.setLanguage('en');
        analytics.setRecipientId('Mother');
        if($window.device) {
          analytics.setDeviceId($cordovaDevice.getUUID());
        }
        // Report app start up
        analytics.reportEvent('Init', 'Init', 'App', 'Init');        
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
        if(settings.notificationHour === undefined) settings.notificationHour = 18;
        if(settings.notificationminute === undefined) settings.notificationminute = 0;
        if(settings.motherName === undefined) settings.motherName = 'Mum';
        settings.save();
        console.log(settings);
        // Get device width and height
        // TODO: move into device service
        var windowElement = angular.element($window);
        $window.deviceWidth = windowElement[0].innerWidth;
        $window.deviceHeight = windowElement[0].innerHeight;
        // Set up default notification
        if(settings.notification) {
          var message = config.notificationMessage;
          message = message.replace('Mum', settings.motherName);
          message = message.replace('mum', settings.motherName.toLowerCase());
          notification.set(settings.notificationHour, settings.notificationMinute, message);
        } else {
          notification.clear();
        }
      });
  });

}());
