(function() {

  "use strict";

  angular.module('state/home/settings').config(function($stateProvider) {
    $stateProvider.state('home.settings', {
      url: '/settings',
      templateUrl: 'state/home/settings/settings.part.html',
      controller: function(
        /* ANG */ $scope, $window, $document, $timeout, $q,
        /* 3RD */ $state, $translate,
        /* GMC */ notification, localisation, analytics, settings,
        /* APP */ config, mumPetName, texts) {
        // Report settings page init
        analytics.reportEvent('Init', 'Page', 'Settings', 'Init');        
        // Get device width and height
        // TODO: move into service
        $scope.deviceWidth = $window.deviceWidth;    
        $scope.deviceHeight = $window.deviceHeight;    
        // Put settings on the scope so we can bind to it from the partial
        $scope.settings = settings;
        // Intentions
        $scope.intentions = [
          {name: 'how-are-you', trans:'INT_HOW'},
          {name: 'I-think-of-you', trans:'INT_THINK'},
          {name: 'jokes', trans:'INT_JOKES'},
          {name: 'thank-you', trans:'INT_THANK'},
          {name: 'a-few-words-for-you', trans:'INT_WORDS'},
          {name: 'I-love-you', trans:'INT_LOVE'},
          {name: 'I-miss-you', trans:'INT_MISS'},
          {name: 'I-am-here-for-you', trans:'INT_HERE'},
          {name: 'facebook-status', trans:'INT_FB'},
          {name: 'positive-thoughts', trans:'INT_POS'},
          {name: 'would-you-care-for-a-drink', trans:'INT_DRINK'}
        ];
        // Initialise dropdowns
        initMumPetNameDropdown();
        initEmailSubjectDropdown();
        initLanguageDropdown();
        // Re-Initialise dropdowns on language change
        localisation.onLanguageChange(function() {
          initMumPetNameDropdown();
          initEmailSubjectDropdown();
          initLanguageDropdown();
        });
        // Set default intention weights
        for(var i=0; i<$scope.intentions.length; i++) {
          if(settings[$scope.intentions[i].name] === undefined) {
            settings[$scope.intentions[i].name] = 'few'; 
          }
        }
        settings.save();
        // Intention weight adjusted
        $scope.intentionWeightChange = function(intention) {
          // Report intention weight change
          analytics.reportEvent('Command', intention.name, 'Settings', 'click', settings[intention.name]);        
        };
        // Notification time/enable adjusted
        $scope.notificationChange = function() {
          if(settings.notification) {
            // Report notification time
            analytics.reportEvent('Command', 'NotificationTime', 'Settings', 'click', settings.notificationHour + ":" + settings.notificationMinute);        
            // Set notification 
            $translate('NOTIFICATION').then(function (notificationText) {
              notification.set(settings.notificationHour, settings.notificationMinute, mumPetName.replace(notificationText, settings.mumPetName));
            });
          } else {
            // Report notification disabled
            analytics.reportEvent('Command', 'NotificationDisabled', 'Settings', 'click');        
            // Clear notification
            notification.clear();
          }
        };
        // Initialise language dropdown list
        function initLanguageDropdown() {
          $scope.languages = [
            {text: $translate.instant('LANGUAGE_ENGLISH'), language:'en'},
            {text: $translate.instant('LANGUAGE_FRENCH'), language:'fr'},
            {text: $translate.instant('LANGUAGE_SPANISH'), language:'es'}
          ];
          var currentLanguage = localisation.getLanguage();
          for(var i=0; i<$scope.languages.length; i++) {
            if($scope.languages[i].language === currentLanguage) {
              $scope.language = angular.copy($scope.languages[i]);
              break;
            }
          }
          $scope.languageSelected = function(selected) {
            if(selected.language === 'auto') {
              delete settings.language;
            } else {
              settings.language = selected.language;
            }
            // Save settings
            settings.save();
            // Re-localise
            localisation.localise(settings.language);
            // Record language change
            $scope.languageChanged = true;
          };
        }
        $scope.closeButtonClick = function() {
          // If language has changed 
          if($scope.languageChanged) {
            // Go back to splash screen
            $state.go('splash');
          } else {
            // Go back to home screen
            $state.go('^');
          }
        }; 
        // Initialise email subjects dropdown list
        function initEmailSubjectDropdown() {
          $q.all([
            $translate('EMAIL_SUBJECT_0'),
            $translate('EMAIL_SUBJECT_1'),
            $translate('EMAIL_SUBJECT_2'),
            $translate('EMAIL_SUBJECT_3'),
            $translate('EMAIL_SUBJECT_4'),
            $translate('EMAIL_SUBJECT_5')
          ]).then(function(translatedSubjects) {
            $scope.emailSubjects = [];
            for(var i=0; i<translatedSubjects.length; i++) {
              $scope.emailSubjects.push({text: mumPetName.replace(translatedSubjects[i], settings.mumPetName)});
            }
            $scope.emailSubject = angular.copy($scope.emailSubjects[settings.emailSubjectIndex]);
          });
          $scope.$watch('emailSubject', function(emailSubjectObject) {
            for(var i=0; i<$scope.emailSubjects.length; i++) {
              if($scope.emailSubjects[i].text === emailSubjectObject.text) {
                settings.emailSubjectIndex = i;
                break;
              }
            }
            settings.save();
          }, true);
        }
        // Initialise mum pet names dropdown data
        function initMumPetNameDropdown() {
          delete $scope.mumPetNames;
          // Only do pet name replacement on english version
          if(localisation.getLanguage() === 'en') {
            var mumPetNames = mumPetName.getNames();
            $scope.mumPetNames = [];
            for(var p=0; p<mumPetNames.length; p++) {
              var petNameSelectObject = {text:mumPetNames[p]};
              $scope.mumPetNames.push(petNameSelectObject); 
              if(mumPetNames[p] === settings.mumPetName) {
                $scope.mumPetName = angular.copy(petNameSelectObject);
              }
            }
            $scope.$watch('mumPetName', function(petNameSelectObject) {
              settings.mumPetName = petNameSelectObject.text;
              settings.save();
              // Re initialise email subject dropdown with pet name replacements
              initEmailSubjectDropdown();
            }, true);
          }
        }
      }
    });
  });

}());
