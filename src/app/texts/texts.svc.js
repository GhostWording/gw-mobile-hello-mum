(function() {

  "use strict";

  angular.module('app/texts').factory('texts', function(currentLanguage, $q, helloMumSvc, helloMumTextsSvc, helperSvc) {
    var _selectedTexts;
    var texts = {
      // Fetch text list
      fetch: function(done) {
        // TODO : if we know the user gender, we should set it before calling filtering functions (or use a watch to refilter)
        //helloMumSvc.setUserGender('H'); // you would do that if you learn that recipient gender is Male
        // TODO : add mechanism to check for cache staleness somewhere in the app

        // Get slugs and default weights for hello mum intentions (
        var weightedIntentions = helloMumSvc.intentionDefaultWeights();

        // TODO : adjust intention userWeight properties according to user choice (none, few, many)
        // .....

        // Set intention weights = defaultWeight * userWeight
        helloMumSvc.setIntentionWeights(weightedIntentions);

        // Get text list promises for the intentions (from cache if previously queried)

        currentLanguage.setLanguageCode('en',true); // Should be set when app initialize, or use 'en-EN'
        var textListPromises = helloMumTextsSvc.textListPromises(weightedIntentions,currentLanguage.currentCulture()); // 'en-EN' can be used as hard coded culture

        _selectedTexts = [];

        // When all texts have been fetched
        $q.all(textListPromises).then(function (resolvedTextLists) {
          // Associate texts lists with weighted intentions
          helloMumTextsSvc.attachFilteredTextListsToWeightedIntentions(weightedIntentions,resolvedTextLists);
          // Pick 8 texts
          for (var i = 0; i < 8;  i++  ) {
            // Will randomly choose an intention then a text
            var choice = chooseText(weightedIntentions);
              // Texts may look better without quotation marks
              choice.text.Content = helperSvc.replaceAngledQuotes(choice.text.Content," ");
              _selectedTexts.push(choice);
          }
          // Done
          done(_selectedTexts);
        });

        // Will try to pick a random text until satisfied
        var chooseText = function(weightedIntentions) {
          var choice;
          var happyWithChoice = true;
          do {
             choice = helloMumSvc.pickOneTextFromWeightedIntentionArray(weightedIntentions);
          } while (happyWithText(choice.text) === false);
          //console.log(choice.text.SortBy + ' ** ' + choice.text.Content);
          //console.log(choice.text);
          return choice;
        };

        // Let us say that 'burnt' texts are texts disliked + texts already sent
        // We don't want them

        // TODO : if chosen text is burnt, express deep sadness
        var happyWithText = function(pickedText) {
          // TODO : check that text has not been picked during this session
          // if matching text Id in $scope.choices, return false
          // TODO : check that text has not been disliked previously
          // TODO : check that text has not already been sent
          return true;
        };
      },
      // Clear cached texts
      clear: function() {
        cacheSvc.reInitializeCacheEntry(_area + '/' + _intention + '/texts.en-EN');
      },
      remove: function(text) {
        _textList.splice(_textList.indexOf(text, 1));
      }
    };
    return texts;
  });

}());
