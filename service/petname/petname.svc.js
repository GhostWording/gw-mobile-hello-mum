(function() {

  "use strict";

  // TODO: move into gw-common?
  angular.module('petname').factory('petName', function(config, localisation) {
    var petName = {
      getNames: function() {
        return config.text.petNames.slice(0);
      },
      replace: function(input, replacement) {
        // No pet name replacement in fr/es languages
        var currentLanguage = localisation.getLanguage();
        if(currentLanguage === 'fr' || currentLanguage === 'es') return input;
        var names = petName.getNames();
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
    return petName;
  });

}());
