(function() {

  "use strict";

  angular.module('app', [
    'ionic',
    'pascalprecht.translate',
    'mobile/notification',
    'mobile/analytics',
    'mobile/localisation',
    'app/state/splash',
    'app/state/splash/genderselect',
    'app/state/home',
    'app/state/home/sendmethod',
    'app/state/home/smswarn',
    'app/state/home/send/sendresult',
    'app/state/settings',
    'app/state/debug',
    'app/global/texts',
    'app/global/config',
    'app/global/mumpetname',
    'app/global/translation'
  ]);

}());
