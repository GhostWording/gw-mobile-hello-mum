(function() {

  "use strict";

  angular.module('app/texts').factory('texts', function(areasSvc, intentionsSvc, textsSvc, recipientTypesSvc, filteredTextListSvc, filtersSvc) {
    var _textList;
    var texts = {
      // TODO: return a promise
      fetch: function(area, intentionSlug, recipientId, done) {
        // Set area
        areasSvc.setCurrentName(area);
        // Set current intention
        intentionsSvc.setIntentionSlug(intentionSlug); 
        // Get recipient types
        // TODO: show an error to the user if we couldn't fetch recipient types (#51)
        recipientTypesSvc.getRecipients().then(function(){
          // Get recipient type tag
          var recipientTypeTag = recipientTypesSvc.getThisOneNow(recipientId).RecipientTypeTag;
          // Fetch text list
          // TODO: show an error to the user if we couldn't fetch texts (#51)
          // TODO: handle localisation
          textsSvc.getCurrentTextList('en-EN').then(function(textList) {
            var user = {};
            // Set recipient type tag on filters service
            filtersSvc.setRecipientTypeTag(recipientTypeTag);
            // Get filters          
            var filters = filtersSvc.filters; 
            // Set up filtered text list service
            filteredTextListSvc.setFilteredAndOrderedList(textList, user, filters.preferredStyles);
            // filter text list
            _textList = filteredTextListSvc.getFilteredTextList();
            // Done
            done(_textList);
          }); 
        });
      },
      // Suggest a text (random at the moment)
      // TODO: improve or use something from gw-common
      suggest: function(excludeText) {
        // TODO: do something when the texts run out!
        if(_textList.length <= 2) return null;
        var suggestedText;
        do {
          var suggestedTextIndex = Math.floor(Math.random() * (_textList.length-1));
          suggestedText = _textList[suggestedTextIndex];
        } while(suggestedText == excludeText);
        return suggestedText;
      },
      remove: function(text) {
        _textList.splice(_textList.indexOf(text, 1));
      }
    };
    return texts;
  });

}());
