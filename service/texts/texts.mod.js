(function() {

  "use strict";

  angular.module('texts', [
    'common/clientService/helloMumClientSvc',
    'common/textSelection/welcomeGroupTextSelectionSvc',
    'common/textSelection/getTextsForRecipientSvc',
    'common/intentions/intentionPonderationSvc',
    'common/services/helperSvc',
    'mobile/localisation',
    'mobile/settings',
    'mobile/config',
    'texts'
  ]);

}());
