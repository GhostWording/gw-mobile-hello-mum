(function() {

  "use strict";

  angular.module('app/config').factory('Config', function() {
    return {
      'apiUrl': 'http://api.cvd.io/'
    };
  });

}());
