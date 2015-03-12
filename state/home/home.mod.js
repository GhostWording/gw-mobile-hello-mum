(function() {

  "use strict";

  angular.module('app/state/home', [
    'common/services/helperSvc',
    'mobile/config',
    'mobile/settings',
    'mobile/slider/fixedslider',
    'mobile/slider/swipehint',
    'mobile/popup/sendmethod',
    'mobile/localisation',
    'mobile/contact',
    'mobile/send/sms',
    'mobile/send/email',
    'app/texts',
    'app/mumpetname',
    'app/state/home/settings',
    'app/state/home/sendmethod',
    'app/state/home/smswarn',
    'app/state/home/emailselect',
    'app/state/home/mobileselect',
    'app/state/home/sendresult',
  ]);

}());
