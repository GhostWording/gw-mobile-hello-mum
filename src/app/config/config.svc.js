(function() {

  "use strict";

  angular.module('app/config').factory('config', function() {
    return {
      'apiUrl': 'http://api.cvd.io/',
      'area': 'HelloMum', 
      'intentionSlug': 'i-think-of-you', 
      'recipientId': 'Mother',
      'UI': {
        'navButtonVOffset': 10
      },
      'imageUrls': [
        'http://critterbabies.com/wp-content/gallery/kittens/803864926_1375572583.jpg',
        'http://static3.shop033.com/resources/18/160536/picture/92/85466258.jpg',
        'http://www.creoglassonline.co.uk/ekmps/shops/bohdan/images/cute-grey-kitten-[2]-6022-p.jpg',
        'http://i.telegraph.co.uk/multimedia/archive/02830/cat_2830677b.jpg',
        'http://www.ringof5.com/userdata/fun_rings/123_1361488102_2190747094.jpg',
        'http://www.mrwallpaper.com/wallpapers/Cute-Kitten-1280x1024.jpg',
        'http://www.coinside.ru/wp-content/uploads/2014/04/animals_widewallpaper_cute-kitty_75417.jpg',
        'http://www.123inspiration.com/wp-content/uploads/2012/11/worlds-cutest-kitten-daisy-1-600x460.jpg'
      ]
    };
  });

}());
