(function() {

  "use strict";

  angular.module('app/state/home/mobileselect').config(function($stateProvider) {
    $stateProvider.state('home.mobileselect', {
      url: '/mobileselect',
      templateUrl: 'app/state/home/mobileselect/mobileselect.part.html',
      controller: function($scope, $state, settings) {
        // Put settings on the scope
        $scope.settings = settings;
        // Ok
        $scope.cancel = function() {
          $state.go('^');
        };
        // Cancel
        $scope.cancel = function() {
          $state.go('^');
        };
      }
    });
  });

}());
