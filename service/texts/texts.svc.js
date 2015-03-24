(function() {

  "use strict";

  angular.module('texts').factory('texts', function(
    /* ANG */ $q,
    /* GWC */ helloMumClientSvc, welcomeGroupTextSelectionSvc, intentionPonderationSvc, getTextsForRecipientSvc, helperSvc, 
    /* GMC */ config, settings, localisation) {
    var service = {
      // Fetch welcome texts from the server (or cache)
      fetchWelcome: function() {
        return helloMumClientSvc.getMumWelcomeTextList(config.text.area, localisation.getLanguage(), localisation.getCulture());
      },
      // Choose (n) welcome texts 
      chooseWelcome: function(texts, n) {
        return welcomeGroupTextSelectionSvc.pickWelcomeTexts(texts, n, helloMumClientSvc.excludeTextFromFirstPositionOfMumTextList);
      },
      // Fetch a text list per intention from the server (or cache)
      fetchAll: function() {
        // Weight the intentions based on user settings
        var weightedIntentions = weightIntentions();
        // Get a text list promise for each intentions (from cache if previously queried),
        // With optional relation type (such as parent or sibling) and recpient gender (such as Female for mother) to limit network traffic
        // We could also get all the texts as they will be refiltered later
        var textListPromises = 
          getTextsForRecipientSvc.textPromisesForTextLists(config.text.area, weightedIntentions, localisation.getCulture(), config.text.relationTypeId, config.text.recipientGender);
        // When text lists have been fetched for all intentions, attach them to the weighted intentions so they can be picked
        return $q.all(textListPromises);
      },
      // Choose (n) texts from the passed text lists
      chooseAll: function(textLists, n) {
        // Get user gender from settings
        var userGender = (settings.userGender == 'Male'?'H':'F');
        // Weight the intentions based on user settings
        var weightedIntentions = weightIntentions();
        // Then set intention weights = defaultWeight * userWeight
        intentionPonderationSvc.setIntentionWeights(weightedIntentions);
        // filter the text list for each intention and add it to the array
        helloMumClientSvc.attachFilteredTextListsToIntentions(weightedIntentions, textLists, config.text.relationTypeId, config.text.recipientGender, userGender);
        // Pick (n) texts
        var choices = [];
        for (var i = 0; i < n;  i++  ) {
          // Will randomly choose an intention then a text
          var choice = helloMumClientSvc.chooseText(weightedIntentions);
          // Texts look better without quotation marks
          choice.text.Content = helperSvc.replaceAngledQuotes(choice.text.Content," ");
          choices.push(choice.text);
        }
        return choices;
      }
    }; 
    // Weight intentions based on user preferences in settings
    function weightIntentions() {
      // Define THE INTENTIONS that will be used by the app, using their slug as id
      var weightedIntentions = helloMumClientSvc.intentionsToDisplay();
      // Iterate through weighted intentions
      for(var i=0; i<weightedIntentions.length; i++) {
        // Find the intention preference in the settings
        var preference = settings[weightedIntentions[i].name];
        if(preference) {
          // Preference exists
          var weight = 1;
          switch(preference) {
            case 'none': weight = 0; break;
            case 'few': weight = 1; break;
            case 'many': weight = 4; break;
          }
          weightedIntentions[i].userWeight = weight;
        }
      }
      // Return weighted intentions
      return weightedIntentions;
    }
    return service;
  });

})();
