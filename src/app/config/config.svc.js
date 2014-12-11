(function() {

  "use strict";

  angular.module('app/config').factory('config', function() {
    return {
      'apiUrl': 'http://api.cvd.io/',
      'area': 'HelloMum',
      'intention': 'i-think-of-you', 
      'recipientType': 'Mother',
      'imagesPerDay': 8,
      'textsPerDay': 8,
      'emailSubject': 'Hello Mum',
      'imageHeightFactor': '0.6',
      'imageUrls': [
        'app/kittens/001.jpg',
        'app/kittens/002.jpg',
        'app/kittens/003.jpg',
        'app/kittens/004.jpg',
        'app/kittens/005.jpg',
        'app/kittens/006.jpg',
        'app/kittens/007.jpg',
        'app/kittens/008.jpg',
        'app/kittens/009.jpg',
        'app/kittens/010.jpg',
        'app/kittens/011.jpg',
        'app/kittens/012.jpg',
        'app/kittens/013.jpg',
        'app/kittens/014.jpg',
        'app/kittens/015.jpg',
        'app/kittens/016.jpg'
      ],
      'endOfFileImageUrl': 'app/kittens/eof.jpg'
    };
  });

}());
