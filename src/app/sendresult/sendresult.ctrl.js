(function() {

  "use strict";

  angular.module('app/sendresult').controller('SendResultCtrl', function($scope, $state, $stateParams, $timeout) {
    console.log('PARAM');
    console.log($stateParams.success);
    // After a second
    $timeout(function() {
      // Return to parent state
      $state.go('^');
    }, 1000);
  });

}());
