(function() {

  "use strict";

  angular.module('app/instructions').factory('instructions', function($ionicPopup) {
    var instructions = {
      show: function(scope) {
        var instructionsScope = scope.$new();
        // TODO: having to add a class to body so we can style the popup instance.. see ionic issue: #1962
        var bodyElement = angular.element(document.getElementsByTagName('body')[0]); 
        bodyElement.addClass('instructionsPopup'); 
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
          bodyElement.removeClass('instructionsPopup');
          instructionsPopup.close();
        });
      }
    };
    return instructions;
  });
}());
