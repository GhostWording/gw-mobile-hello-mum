(function() {

  "use strict";

  angular.module('app/config').factory('config', function() {
    return {
      'apiUrl': 'http://api.cvd.io/',
      'area': 'HelloMum', 
      'intentionSlug': 'i-think-of-you', 
      'UI': {
        'navButtonVOffset': 20
      },
      'imageUrls': [
        'http://critterbabies.com/wp-content/gallery/kittens/803864926_1375572583.jpg',
        'http://critterbabies.com/wp-content/gallery/kittens/Kitten-pic-cute-kittens-16292210-1024-768.jpg',
        'http://static3.shop033.com/resources/18/160536/picture/92/85466258.jpg',
        'http://www.creoglassonline.co.uk/ekmps/shops/bohdan/images/cute-grey-kitten-[2]-6022-p.jpg',
        'http://i.telegraph.co.uk/multimedia/archive/02830/cat_2830677b.jpg',
        'http://images4.fanpop.com/image/photos/16200000/Cute-Little-Kitten-cute-kittens-16288191-1024-768.jpg',
        'http://cdn.cutestpaw.com/wp-content/uploads/2013/01/l-Cute-Kitten.jpg',
        'http://www.ringof5.com/userdata/fun_rings/123_1361488102_2190747094.jpg'
      ]
    };
  });

}());
