(function() {

  "use strict";

  angular.module('app/home').controller('HomeCtrl', function($scope, config) {
    $scope.mobileBlur = function() {
      alert($scope.mobile);
    };
    $scope.emailBlur = function() {
      alert($scope.email);
    };
  });

}());
