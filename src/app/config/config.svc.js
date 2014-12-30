(function() {

  "use strict";

  angular.module('app/config').factory('config', function() {
    return {
      'apiUrl': 'http://api.cvd.io/',
      'imagesPerDay': 8,
      'textsPerDay': 8,
      'emailSubject': 'Hello Mum',
      'notificationMessage': 'Send a message to mum?',
      'imageHeightFactor': '0.55',
      'endOfFileImageUrl': 'app/messageimage/eof.jpg'
    };
  });

}());
