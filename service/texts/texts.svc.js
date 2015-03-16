(function() {

  "use strict";

  angular.module('texts').factory('texts', function($rootScope, $q, $timeout, currentLanguage, helloMumSvc, helloMumTextsSvc, helperSvc, cacheSvc, config, settings, localisation) {
    var _useWelcome;
    var _weightedIntentions;
    var _textLists;
    var _welcomeTextList;
    // TODO: How to simplify this file? It's a bit hairy!
    // TODO: It would be good to generalise it (if possible?) and move into gw-mobile-common
    // TODO: It would be nice not to rely on hello mum specific code in gw-common too
    var texts = {
      // Fetch texts from server (or cache)
      fetch: function() {
        // Text fetch retry function
        function fetchTexts() {
          // Fetch texts
          return (_useWelcome?fetchWelcome():fetchAll())
            .then(function() {
              // Trigger a fetch of all texts in the background
              if(_useWelcome) fetchAll();
              // Hide loading overlay
              $rootScope.loading = false;
            }, function() {
              // Show connectivity text
              $rootScope.connectivity = false;
              // Wait a bit
              return $timeout(function(){}, config.textFetchRetryDelay * 1000)
                .then(function () {
                  // Retry text fetch
                  return fetchTexts();
                });
            });
        }
        // Show loading overlay
        $rootScope.loading = true;
        // Decide whether to fetch welcome texts
        // NOTE: no welcome texts in spanish version
        if(localisation.getLanguage() !== 'es' &&
          (settings.welcomeTextsShownCount === undefined || 
          settings.welcomeTextsShownCount < config.showWelcomeTextTimes)) {
            // Use welcome texts
            _useWelcome = true;
            // Increment welcome text show count
            if(settings.welcomeTextsShownCount === undefined) {
              settings.welcomeTextsShownCount = 1;
            } else {
              settings.welcomeTextsShownCount ++;
            }
        } else {
          // Use all texts
          _useWelcome = false;
        }
        // Fetch texts (with retry)
        return fetchTexts();
       },
      // Choose (n) texts
      choose: function(n) {
        // If welcome text flash
        if(_useWelcome) {
          var pickedTextList = helloMumTextsSvc.pickWelcomeTexts(_welcomeTextList, n); 
          var returnTextList = []; 
          // Having to do this because unlike pickOneTextFromWeightedIntentionArray pickWelcomeTexts does not return intention/text pairs 
          for(var wt=0; wt<pickedTextList.length; wt++) {
            var text = pickedTextList[wt];
            text.Content = helperSvc.replaceAngledQuotes(text.Content,"");
            returnTextList.push({text: pickedTextList[wt]}); 
          }
          return returnTextList;
        } else {
          // Associate texts lists with weighted intentions
          helloMumTextsSvc.attachFilteredTextListsToWeightedIntentions(_weightedIntentions, _textLists);
          // Pick n texts
          var selectedTexts = []; 
          for (var t = 0; t < n;  t++  ) {
            // Will randomly choose an intention then a text
            var choice = chooseText(_weightedIntentions);
            // Texts may look better without quotation marks
            choice.text.Content = helperSvc.replaceAngledQuotes(choice.text.Content,"");
            selectedTexts.push(choice);
          }
          return selectedTexts; 
        }
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
      remove: function(text) {
        _textList.splice(_textList.indexOf(text, 1));
      }
    };
    // Fetch welcome text list
    function fetchWelcome() {
      // Set user gender
      if(settings.userGender === 'Male') helloMumTextsSvc.setUserGender('H');
      if(settings.userGender === 'Female') helloMumTextsSvc.setUserGender('F');
      return helloMumTextsSvc.getWelcomeTextList('HelloMum', localisation.getLanguage()).then(function(textList) {
        _welcomeTextList = textList;
        return textList;
      }); 
    }
    // Fetch text list
    function fetchAll() {
      // Set user gender
      if(settings.userGender === 'Male') helloMumTextsSvc.setUserGender('H');
      if(settings.userGender === 'Female') helloMumTextsSvc.setUserGender('F');
      // TODO : add mechanism to check for cache staleness somewhere in the app
      _weightedIntentions = getWeightedIntentions();
      // Get text list promises for the intentions (from cache if previously queried)
      currentLanguage.setLanguageCode(localisation.getLanguage(), true);
      var textListPromises = helloMumTextsSvc.textListPromises(_weightedIntentions, currentLanguage.currentCulture());
      // When all texts have been fetched
      return $q.all(textListPromises).then(function (resolvedTextLists) {
        _textLists = resolvedTextLists;  
        return _textLists;
      });
    }
    // Get a map of weighted intentions
    function getWeightedIntentions() {
      // Get slugs and default weights for hello mum intentions
      var weightedIntentions = helloMumSvc.intentionDefaultWeights();
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
      // Set intention weights = defaultWeight * userWeight
      helloMumSvc.setIntentionWeights(weightedIntentions);
      return weightedIntentions;
    }
    // Choose a random text
    function chooseText(weightedIntentions) {
      var choice;
      var happyWithChoice = true;
      do {
         choice = helloMumSvc.pickOneTextFromWeightedIntentionArray(weightedIntentions);
      } while (happyWithText(choice.text) === false);
      return choice;
    }
    // Text selection criteria
    function happyWithText(pickedText) {
      // Let us say that 'burnt' texts are texts disliked + texts already sent
      // We don't want them
      // TODO : check that text has not been picked during this session
      // if matching text Id in $scope.choices, return false
      // TODO : check that text has not been disliked previously
      // TODO : check that text has not already been sent
      return true;
    }

    return texts;
  });

}());
