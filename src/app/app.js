(function() {

  "use strict";

  angular.module('app')
    .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('splash', {
          url: '/',
          templateUrl: 'app/state/splash/splash.part.html',
          controller: 'SplashCtrl'
        })
        .state('home', {
          url: '/home',
          templateUrl: 'app/state/home/home.part.html',
          controller: 'HomeCtrl',
          resolve: {
            images: function($http, config) {
              return $http.get('messageimages.json').then(function(result) {
                return pickImages(result.data, config.imagesPerDay); 
              });
            },
            texts: function(texts, config) {
              return texts.fetch().then(function() {
                return texts.choose(config.textsPerDay); 
              });
            }
          }
        })
        .state('settings', {
          url: '/settings',
          templateUrl: 'app/state/settings/settings.part.html',
          controller: 'SettingsCtrl'
        })
        .state('home.genderselect', {
          url: '/genderselect',
          template: [
            '<gw-mob-genderselect ',
            'titletext="{{\'I_AM\' | translate}}" ',
            'maletext="{{\'A_MAN\' | translate}}" ',
            'femaletext="{{\'A_WOMAN\' | translate}}" ',
            'maleselected="genderSelected(\'Male\')" ',
            'femaleselected="genderSelected(\'Female\')"> ',
            '</gw-mob-genderselect>'].join(''),
          controller: function($scope) {
            $scope.genderSeleted = function(gender) {
              alert('gender is ' + gender);
            };
          }
        })
        .state('home.send', {
          url: '/send',
          templateUrl: 'app/state/home/send/send.part.html',
          controller: 'SendCtrl' 
        })
        .state('home.sendresult', {
          templateUrl: 'app/state/home/send/sendresult/sendresult.part.html',
          controller: 'SendResultCtrl', 
          params: ['success']
        })
        .state('debug', {
          url: '/debug',
          templateUrl: 'app/state/debug/debug.part.html'
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
          //analytics.initGoogleAnalytics(config.googleAnalyticsTrackerId, config.googleAnalyticsDebugMode);
          // Initialise server analytics
          //analytics.initServerAnalytics();
        }
        // Report app start up
        analytics.reportEvent('Init', 'Init', 'App', 'Init');        
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

  // Select (n) unique images
  // TODO: temporary, move
  function pickImages(candidateImageUrls, numImages) {
    var imageList = [];
    for(var i=0; i<numImages; i++) {
      var image;
      do {
        image = candidateImageUrls[Math.floor(Math.random() * candidateImageUrls.length)];
      } while(imageList.indexOf(image) !== -1); 
      imageList.push(image);
    }
    return imageList;
  }

}());
