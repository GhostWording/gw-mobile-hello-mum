(function() {

  "use strict";

  angular.module('app')
    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $translateProvider) {
      $ionicConfigProvider.platform.android.tabs.position("bottom");
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'app/home/home.part.html'
        })
        .state('genderselect', {
          url: '/genderselect',
          templateUrl: 'app/genderselect/genderselect.part.html'
        })
        .state('textselect', {
          url: '/textselect',
          templateUrl: 'app/textselect/textselect.part.html'
        })
        .state('debug', {
          url: '/debug',
          templateUrl: 'app/debug/debug.part.html'
        });
      $translateProvider.translations('en', {
        "SEND": "Send",
        "CANCEL": "Cancel",
        "DONE": "Done",
        "MUM_MOB": "Mum's mobile number",
        "MUM_EMAIL": "Mum's email address",
        "SND_EMAIL": "Email",
        "SND_SMS": "Text",
        "SND_FACEBOOK": "Facebook",
        "MES_SEND_SUC": "Message Sent",
        "MES_SEND_ERR": "Message Send Error",
        "SMS_IMAGE_WARN": "SMS won't send the image",
        "SEND_BY_EMAIL": "Send by Email",
        "SEND_TEXT_ONLY": "Send Text Only",
        "EOF_IMAGE": "See you tomorrow for more kittens!",
        "EOF_TEXT": "See you tomorrow for more messages!",
        "SET_TAB_MUM": "Mum",
        "SET_TAB_REM": "Reminder",
        "SET_TAB_MES": "Messages",
        "REFER_MUM": "Refer To Mum As",
        "DAILY_REMINDER": "Daily Reminder",
        "TIME_DAY": "Time Of Day",
        "MES_PREF": "What types of messages would you like to send?",
        "MES_PREF_NONE": "none",
        "MES_PREF_FEW": "few",
        "MES_PREF_MANY": "many",
        "SEL_CONT": "Select from contacts",
        "INT_HOW":"How Are You",
        "INT_THINK": "Thinking Of You",
        "INT_JOKES": "Jokes",
        "INT_THANK": "Thank You",
        "INT_WORDS": "A few Words For You",
        "INT_LOVE": "I Love You",
        "INT_MISS": "I Miss You",
        "INT_HERE": "I'm Here For You",
        "INT_FB": "Mood Of The Day",
        "INT_POS": "Positive Thoughts",
        "INT_DRINK": "Care For A Drink?",
        "OTD_THOUGHT": "Thought of the day",
        "OTD_JOKE": "Joke of the day",
        "EMAIL_SUBJECT": "Hello Mum",
        "NOTIFICATION": "Say hello to mum? (new kittens!)"
      });
      $translateProvider.translations('fr', {
        "SEND": "Send [F]",
        "CANCEL": "Cancel [F]",
        "DONE": "Done [F]",
        "MUM_MOB": "Mum's mobile number [F]",
        "MUM_EMAIL": "Mum's email address [F]",
        "SND_EMAIL": "Email [F]",
        "SND_SMS": "Text [F]",
        "SND_FACEBOOK": "Facebook [F]",
        "MES_SEND_SUC": "Message Sent [F]",
        "MES_SEND_ERR": "Message Send Error [F]",
        "SMS_IMAGE_WARN": "SMS won't send the image [F]",
        "SEND_BY_EMAIL": "Send by Email [F]",
        "SEND_TEXT_ONLY": "Send Text Only [F]",
        "EOF_IMAGE": "See you tomorrow for more kittens! [F]",
        "EOF_TEXT": "See you tomorrow for more messages! [F]",
        "SET_TAB_MUM": "Mum [F]",
        "SET_TAB_REM": "Reminder [F]",
        "SET_TAB_MES": "Messages [F]",
        "REFER_MUM": "Refer To Mum As [F]",
        "DAILY_REMINDER": "Daily Reminder [F]",
        "TIME_DAY": "Time Of Day [F]",
        "MES_PREF": "What types of messages would you like to send? [F]",
        "MES_PREF_NONE": "none [F]",
        "MES_PREF_FEW": "few [F]",
        "MES_PREF_MANY": "many [F]",
        "SEL_CONT": "Select from contacts [F]",
        "INT_HOW":"How Are You [F]",
        "INT_THINK": "Thinking Of You [F]",
        "INT_JOKES": "Jokes [F]",
        "INT_THANK": "Thank You [F]",
        "INT_WORDS": "A few Words For You [F]",
        "INT_LOVE": "I Love You [F]",
        "INT_MISS": "I Miss You [F]",
        "INT_HERE": "I'm Here For You [F]",
        "INT_FB": "Mood Of The Day [F]",
        "INT_POS": "Positive Thoughts [F]",
        "INT_DRINK": "Care For A Drink? [F]",
        "OTD_THOUGHT": "Thought of the day [F]",
        "OTD_JOKE": "Joke of the day [F]",
        "EMAIL_SUBJECT": "Hello Mum [F]",
        "NOTIFICATION": "Say hello to mum? (new kittens!) [F]"
      });
      $translateProvider.preferredLanguage('en');
    })
    .run(function($window, $ionicPlatform, $cordovaDevice, $translate, config, settings, notification, analytics, mumPetName) {
      $ionicPlatform.ready(function() {
        // Set up analytics
        analytics.setArea('HelloMum');
        analytics.setLanguage('fr');
        analytics.setRecipientId('Mother');
        // If we are on a device (not browser)
        if($window.device) {
          // Set the device ID
          analytics.setDeviceId($cordovaDevice.getUUID());
          // Initialise google analytics
          analytics.initGoogleAnalytics(config.googleAnalyticsTrackerId, config.googleAnalyticsDebugMode);
          // Initialise server analytics
          analytics.initServerAnalytics();
        }
        // Report app start up
        analytics.reportEvent('Init', 'Init', 'App', 'Init');        
        // Init localisation
        $translate.use('de');
        // Hide accessory bar
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
        // Set settings template
        settings.setTemplateUrl('app/settings/settings.part.html');
        // Set up default settings
        // TODO: move this into settings
        if(settings.notification === undefined) settings.notification = true;
        if(settings.notificationHour === undefined) settings.notificationHour = config.defaultNotificationHour;
        if(settings.notificationminute === undefined) settings.notificationMinute = config.defaultNotificationMinute;
        if(settings.mumPetName === undefined) settings.mumPetName = 'Mum';
        settings.save();
        console.log(settings);
        // Get device width and height
        // TODO: move into device service
        var windowElement = angular.element($window);
        $window.deviceWidth = windowElement[0].innerWidth;
        $window.deviceHeight = windowElement[0].innerHeight;
        // Set up default notification
        if(settings.notification) {
          $translate('NOTIFICATION').then(function (notificationText) {
            notification.set(settings.notificationHour, settings.notificationMinute, mumPetName.replace(notificationText, settings.mumPetName));
          });
        } else {
          notification.clear();
        }
      });
  });

}());
