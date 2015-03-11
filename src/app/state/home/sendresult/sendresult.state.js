(function() {

  "use strict";

  angular.module('app/state/home/sendresult').config(function($stateProvider) {
    $stateProvider.state('home.sendresult', {
      url: '/sendresult/:success',
      templateUrl: 'app/state/home/sendresult/sendresult.part.html',
      controller: function($scope, $state, $stateParams, $timeout, config) {
        // Get success parameter
        $scope.success = ($stateParams.success === 'true');
        // After show time has elapsed
        $timeout(function() {
          // Go home
          $state.go('home');  
        }, config.sendResultPopupShowTime);
      }
    });
  });

}());
