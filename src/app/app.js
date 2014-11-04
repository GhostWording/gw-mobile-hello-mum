(function() {

  "use strict";

  angular.module('app')
    .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'app/home/home.part.html'
        })
        .state('intentions', {
          url: '/intentions',
          templateUrl: 'app/intentions/intentions.part.html'
        })
        .state('texts', {
          url: '/texts',
          templateUrl: 'app/textlist/textlist.part.html'
        });
  })
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide accessory bar
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });

}());
