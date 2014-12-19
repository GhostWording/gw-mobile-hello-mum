(function() {

  "use strict";

  angular.module('app/texts').factory('texts', function(currentLanguage, $q, helloMumSvc, helloMumTextsSvc, helperSvc, cacheSvc) {
    var _weightedIntentions;
    var _textLists;
    var texts = {
      // Fetch text list
      fetch: function(done) {
        // TODO : if we know the user gender, we should set it before calling filtering functions (or use a watch to refilter)
        //helloMumSvc.setUserGender('H'); // you would do that if you learn that recipient gender is Male
        // TODO : add mechanism to check for cache staleness somewhere in the app
        _weightedIntentions = getWeightedIntentions();

        // Get text list promises for the intentions (from cache if previously queried)
        currentLanguage.setLanguageCode('en',true); // Should be set when app initialize, or use 'en-EN'
        var textListPromises = helloMumTextsSvc.textListPromises(_weightedIntentions,currentLanguage.currentCulture()); // 'en-EN' can be used as hard coded culture

        // When all texts have been fetched
        $q.all(textListPromises).then(function (resolvedTextLists) {
          _textLists = resolvedTextLists;  
          done();
        });
      },
      choose: function(n) {
        // Associate texts lists with weighted intentions
        helloMumTextsSvc.attachFilteredTextListsToWeightedIntentions(_weightedIntentions, _textLists);
        // Pick n texts
        var selectedTexts = []; 
        for (var i = 0; i < n;  i++  ) {
          // Will randomly choose an intention then a text
          var choice = chooseText(_weightedIntentions);
          // Texts may look better without quotation marks
          choice.text.Content = helperSvc.replaceAngledQuotes(choice.text.Content," ");
          selectedTexts.push(choice);
        }
        return selectedTexts; 
      },
      getAll: function() {
        var intentions = [];
        for(var i=0; i<_textLists.length; i++) {
          intentions.push({
            intention: _weightedIntentions[i],
            textList: _textLists[i]
          }); 
        }
        return intentions;
      },
      // Clear cached texts
      clear: function() {
        /*
        for(var i=0; i<_weightedIntentions.length; i++) {
          var intentionName = _weightedIntentions[i].name;
          console.log('HelloMum/' + intentionName + '/texts.en-EN');
          cacheSvc.reInitializeCacheEntry('HelloMum/' + intentionName + '/texts.en-EN');
        }
        */
      },
      remove: function(text) {
        _textList.splice(_textList.indexOf(text, 1));
      }
    };

    function getWeightedIntentions() {
      // Get slugs and default weights for hello mum intentions (
      var weightedIntentions = helloMumSvc.intentionDefaultWeights();

      // TODO : adjust intention userWeight properties according to user choice (none, few, many)
      // .....

      // Set intention weights = defaultWeight * userWeight
      helloMumSvc.setIntentionWeights(weightedIntentions);

      return weightedIntentions;
    }

    // Will try to pick a random text until satisfied
    function chooseText(weightedIntentions) {
      var choice;
      var happyWithChoice = true;
      do {
         choice = helloMumSvc.pickOneTextFromWeightedIntentionArray(weightedIntentions);
      } while (happyWithText(choice.text) === false);
      //console.log(choice.text.SortBy + ' ** ' + choice.text.Content);
      //console.log(choice.text);
      return choice;
    }

    // Let us say that 'burnt' texts are texts disliked + texts already sent
    // We don't want them

    // TODO : if chosen text is burnt, express deep sadness
    function happyWithText(pickedText) {
      // TODO : check that text has not been picked during this session
      // if matching text Id in $scope.choices, return false
      // TODO : check that text has not been disliked previously
      // TODO : check that text has not already been sent
      return true;
    }

    return texts;
  });

}());
