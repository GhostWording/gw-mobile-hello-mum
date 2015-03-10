(function() {

  "use strict";

  angular.module('app/state/home/emailselect').config(function($stateProvider) {
    $stateProvider.state('home.emailselect', {
      url: '/emailselect',
      templateUrl: 'app/state/home/emailselect/emailselect.part.html',
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
