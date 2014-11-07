(function() {

  "use strict";

  angular.module('app/config').factory('config', function() {
    return {
      'apiUrl': 'http://api.cvd.io/',
      'area' : 'Mother', 
      'intentionSlug': 'happy-birthday',
      'imageUrls': [
        'http://images4.fanpop.com/image/photos/16200000/Cute-Little-Kitten-cute-kittens-16288191-1024-768.jpg',
        'http://r.ddmcdn.com/w_622/u_0/gif/05-kitten-cuteness-1.jpg'
      ]
    };
  });

}());
