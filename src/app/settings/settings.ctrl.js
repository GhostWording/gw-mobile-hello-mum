(function() {

  "use strict";

  angular.module('app/settings').controller('SettingsCtrl', function($window, $scope, $translate, $q, config, notification, localisation, analytics, mumPetName) {
    // Report settings page init
    analytics.reportEvent('Init', 'Page', 'Settings', 'Init');        
    // Get device width and height
    // TODO: move into service
    $scope.deviceWidth = $window.deviceWidth;    
    $scope.deviceHeight = $window.deviceHeight;    
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
    // Set default intention weights
    for(var i=0; i<$scope.intentions.length; i++) {
      if($scope.settings[$scope.intentions[i].name] === undefined) {
        $scope.settings[$scope.intentions[i].name] = 'few'; 
      }
    }
    $scope.settings.save();
    // Intention weight adjusted
    $scope.intentionWeightChange = function(intention) {
      // Report intention weight change
      analytics.reportEvent('Command', intention.name, 'Settings', 'click', $scope.settings[intention.name]);        
    };
    // Notification time/enable adjusted
    $scope.notificationChange = function() {
      if($scope.settings.notification) {
        // Report notification time
        analytics.reportEvent('Command', 'NotificationTime', 'Settings', 'click', $scope.settings.notificationHour + ":" + $scope.settings.notificationMinute);        
        // Set notification 
        $translate('NOTIFICATION').then(function (notificationText) {
          notification.set($scope.settings.notificationHour, $scope.settings.notificationMinute, mumPetName.replace(notificationText, $scope.settings.mumPetName));
        });
      } else {
        // Report notification disabled
        analytics.reportEvent('Command', 'NotificationDisabled', 'Settings', 'click');        
        // Clear notification
        notification.clear();
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
          $scope.emailSubjects.push({text: mumPetName.replace(translatedSubjects[i], $scope.settings.mumPetName)});
        }
        $scope.emailSubject = angular.copy($scope.emailSubjects[$scope.settings.emailSubjectIndex]);
      });
      $scope.$watch('emailSubject', function(emailSubjectObject) {
        for(var i=0; i<$scope.emailSubjects.length; i++) {
          if($scope.emailSubjects[i].text === emailSubjectObject.text) {
            $scope.settings.emailSubjectIndex = i;
            break;
          }
        }
        $scope.settings.save();
      }, true);
    }
    // Initialise mum pet names dropdown data
    function initMumPetNameDropdown() {
      // Only do pet name replacement on english version
      if(localisation.getLanguage().indexOf('en') !== -1) {
        var mumPetNames = mumPetName.getNames();
        $scope.mumPetNames = [];
        for(var p=0; p<mumPetNames.length; p++) {
          var petNameSelectObject = {text:mumPetNames[p]};
          $scope.mumPetNames.push(petNameSelectObject); 
          if(mumPetNames[p] === $scope.settings.mumPetName) {
            $scope.mumPetName = angular.copy(petNameSelectObject);
          }
        }
        $scope.$watch('mumPetName', function(petNameSelectObject) {
          $scope.settings.mumPetName = petNameSelectObject.text;
          $scope.settings.save();
          // Re initialise email subject dropdown with pet name replacements
          initEmailSubjectDropdown();
        }, true);
      }
    }
  });

}());
