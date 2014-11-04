(function() {

  "use strict";

  angular.module('app/config').factory('config', function() {
    return {
      'apiUrl': 'http://api.cvd.io/',
      'area' : 'Mother', 
      'intentionSlug': 'happy-birthday'
    };
  });

}());
