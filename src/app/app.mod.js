(function() {

  "use strict";

  angular.module('app', [
    'ionic',
    'pascalprecht.translate',
    'mobile/notification',
    'mobile/analytics',
    'mobile/localisation',
    'mobile/popup/genderselect',
    'app/state/splash',
    'app/state/home',
    'app/state/home/send',
    'app/state/home/send/sendresult',
    'app/state/settings',
    'app/state/debug',
    'app/global/texts',
    'app/global/config',
    'app/global/mumpetname',
    'app/global/translation'
  ]);

}());
