(function() {

  "use strict";

  angular.module('app/global/config').factory('config', function() {
    return {
      'apiUrl': 'http://api.cvd.io/',
      'textFetchRetryDelay': 4,
      'imagesPerDay': 8,
      'textsPerDay': 8,
      'showWelcomeTextTimes': 2,
      'imageHeightFactor': 0.55,
      'defaultNotificationHour': 16,
      'defaultNotificationMinute': 0,
      'googleAnalyticsTrackerId': 'UA-47718196-5',
      'googleAnalyticsDebugMode': true,
      'sendResultPopupShowTime': 1500
    };
  });

}());
