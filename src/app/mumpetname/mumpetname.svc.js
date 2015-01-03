(function() {

  "use strict";

  angular.module('app/mumpetname').factory('mumPetName', function() {
    var mumPetName = {
      getNames: function() {
        // TODO: Localise
        // Mother names
        return [
          'Mum',
          'Mummy',
          'Mommy',
          'Mom',
          'Mam',
          'Mother'
        ];
      },
      replace: function(input, replacement) {
        var names = mumPetName.getNames();
        // Sort by length so we dont multi-replace
        names.sort(function(a, b){
          return b.length - a.length;
        }); 
        // Remove replacement from names list
        var index = names.indexOf(replacement);
        if(index !== -1) {
          names.splice(index, 1);
        }
        // Replace all names with replacement
        for(var i=0; i<names.length; i++) {
          input = input.replace(new RegExp("\\b" + names[i] + "\\b", "g"), replacement);
          input = input.replace(new RegExp("\\b" + names[i].toLowerCase() + "\\b", "g"), replacement.toLowerCase());
        }
        // Return result
        return input;
      }
    }; 
    return mumPetName;
  });

}());
