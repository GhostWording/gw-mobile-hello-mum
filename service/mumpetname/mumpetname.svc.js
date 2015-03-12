(function() {

  "use strict";

  angular.module('mumpetname').factory('mumPetName', function(localisation) {
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
          'Maa',
          'Mama',
          'Mother'
        ];
      },
      replace: function(input, replacement) {
        // No pet name replacement in fr/es languages
        var currentLanguage = localisation.getLanguage();
        if(currentLanguage === 'fr' || currentLanguage === 'es') return input;
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
