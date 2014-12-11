(function() {

  "use strict";

  angular.module('app/texts').factory('texts', function(areasSvc, intentionsSvc, textsSvc, recipientTypesSvc, filteredTextListSvc, filtersSvc, cacheSvc) {
    var _area;
    var _intention;
    var _recipientType;
    var _textList;
    var texts = {
      // Set the area
      setArea: function(area) {
        _area = area; 
      },
      // Set the intention
      setIntention: function(intention) {
        _intention = intention; 
      },
      // Set the recipient type
      setRecipientType: function(recipientType) {
        _recipientType = recipientType; 
      },
      // Fetch text list
      // TODO: return a promise
      fetch: function(done) {
        // Set area
        areasSvc.setCurrentName(_area);
        // Set current intention
        intentionsSvc.setIntentionSlug(_intention); 
        // Get recipient types
        // TODO: show an error to the user if we couldn't fetch recipient types (#51)
        recipientTypesSvc.getRecipients().then(function(){
          // Get recipient type tag
          var recipientTypeTag = recipientTypesSvc.getThisOneNow(_recipientType).RecipientTypeTag;
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
      // Clear cached texts
      clear: function() {
        cacheSvc.reInitializeCacheEntry(_area + '/' + _intention + '/texts.en-EN');
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
