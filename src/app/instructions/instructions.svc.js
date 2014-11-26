(function() {

  "use strict";

  angular.module('app/instructions').factory('instructions', function($ionicPopup) {
    var instructions = {
      show: function(scope) {
        var instructionsScope = scope.$new();
        var instructionsPopup = $ionicPopup.show({
          templateUrl: 'app/instructions/instructions.part.html',
          scope: instructionsScope,
          buttons: [
            { text: 'Close' },
          ]
        });
        instructionsScope.close= function() {
          instructionsPopup.close();
        };
        // Hide the popup if the passed scope is destroyed
        scope.$on('$destroy', function() {
          instructionsPopup.close();
        });
      }
    };
    return instructions;
  });
}());
