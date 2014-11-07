(function() {

  "use strict";

  angular.module('app')
    .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        /*
        .state('home', {
          url: '/',
          templateUrl: 'app/home/home.part.html'
        })
        .state('intentions', {
          url: '/intentions',
          templateUrl: 'app/intentions/intentions.part.html'
        })
        */
        .state('texts', {
          url: '/',
          templateUrl: 'app/textselect/textselect.part.html',
          controller: 'TextSelectCtrl',
          resolve: {
            currentIntention: function($stateParams) {
              // TODO: remove this
              return 'i-think-of-you';
            }
          }
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
