(function() {

  "use strict";

  angular.module('app', [
    'ionic',
    'ngCordova.plugins.device',
    'pascalprecht.translate',
    'mobile/notification',
    'mobile/analytics',
    'mobile/localisation',
    'app/state/splash',
    'app/state/home',
    'app/state/debug',
    'app/global/texts',
    'app/global/config',
    'app/global/mumpetname',
    'app/global/translation'
  ]);

}());
