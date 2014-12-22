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
    .run(function($window, $ionicPlatform, settings, notification) {
      $ionicPlatform.ready(function() {
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
        // Get device width and height
        // TODO: move into device service
        var windowElement = angular.element($window);
        $window.deviceWidth = windowElement[0].innerWidth;
        $window.deviceHeight = windowElement[0].innerHeight;
        // Set up default notification
        notification.clear();
        if(!notification.isSet()) {
          notification.set('4:20', '!!!!!');
          notification.onTrigger = function() {
            alert('triggered');
          };
        }
      });
  });

}());
