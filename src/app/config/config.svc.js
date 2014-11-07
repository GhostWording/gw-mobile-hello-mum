(function() {

  "use strict";

  angular.module('app/config').factory('config', function() {
    return {
      'apiUrl': 'http://api.cvd.io/',
      'area' : 'HelloMum', 
      'imageUrls': [
        'http://i.telegraph.co.uk/multimedia/archive/02830/cat_2830677b.jpg',
        'http://images4.fanpop.com/image/photos/16200000/Cute-Little-Kitten-cute-kittens-16288191-1024-768.jpg',
        'http://cdn.cutestpaw.com/wp-content/uploads/2013/01/l-Cute-Kitten.jpg',
        'http://www.ringof5.com/userdata/fun_rings/123_1361488102_2190747094.jpg'
      ],
      'backgroundColours': [
        '6b6158',
        'd9d18d',
        'ffffff',
        '284061'
      ]
    };
  });

}());
