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
      // TODO: move out into seperate JSON file and async load
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
      // TODO: move out into seperate JSON file and async load
      $translateProvider.translations('fr', {
        "SEND": "Envoyer",
        "CANCEL": "Annuler",
        "DONE": "Fermer",
        "MUM_MOB": "No de téléphone de maman",
        "MUM_EMAIL": "Adresse mail de maman",
        "SND_EMAIL": "Email",
        "SND_SMS": "Texto",
        "SND_FACEBOOK": "Facebook",
        "MES_SEND_SUC": "Message envoyé",
        "MES_SEND_ERR": "Echec de l'envoi",
        "SMS_IMAGE_WARN": "Les SMS n'envoient pas les photos",
        "SEND_BY_EMAIL": "Envoyer par email",
        "SEND_TEXT_ONLY": "Envoyer seulement le texte",
        "EOF_IMAGE": "A demain pour de nouveaux chatons!",
        "EOF_TEXT": "A demain pour de nouveaux messages!",
        "SET_TAB_MUM": "Maman",
        "SET_TAB_REM": "Rappels",
        "SET_TAB_MES": "Messages",
        "REFER_MUM": "Diminutif à utiliser pour maman",
        "DAILY_REMINDER": "Rappel quotidien",
        "TIME_DAY": "Heure du jour",
        "MES_PREF": "Quels types de messages voulez-vous envoyer ?",
        "MES_PREF_NONE": "aucun",
        "MES_PREF_FEW": "peu",
        "MES_PREF_MANY": "beaucoup",
        "SEL_CONT": "Choisir dans les contacts",
        "INT_HOW":"Comment vas-tu ?",
        "INT_THINK": "Je pense à toi",
        "INT_JOKES": "Histoires drôles",
        "INT_THANK": "Merci",
        "INT_WORDS": "Quelques mots pour toi",
        "INT_LOVE": "Je t'aime",
        "INT_MISS": "Tu me manques",
        "INT_HERE": "Je suis là pour toi",
        "INT_FB": "Humeur du jour (fb)",
        "INT_POS": "Pensées positives",
        "INT_DRINK": "Prenons un café",
        "OTD_THOUGHT": "Pensée du jour",
        "OTD_JOKE": "Histoire du jour",
        "EMAIL_SUBJECT": "Hello maman",
        "NOTIFICATION": "Un message pour maman? (nouveaux chatons!)"
       });
      $translateProvider.preferredLanguage('en');
    })
    .run(function($window, $ionicPlatform, $cordovaDevice, $translate, config, settings, notification, analytics, localisation, mumPetName) {
      $ionicPlatform.ready(function() {
        // Set up analytics
        analytics.setArea('HelloMum');
        // TODO: set from gw-mobile-common localise service
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
        // Localise!
        localisation.localise();
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
