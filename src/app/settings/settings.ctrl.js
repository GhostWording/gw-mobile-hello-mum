(function() {

  "use strict";

  angular.module('app/settings').controller('SettingsCtrl', function($window, $scope, $translate, config, notification, analytics, mumPetName) {
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
    // Initialise mum pet names dropdown data
    var mumPetNames = mumPetName.getNames();
    $scope.mumPetNames = [];
    for(var p=0; p<mumPetNames.length; p++) {
      var petNameSelectObject = {text:mumPetNames[p]};
      $scope.mumPetNames.push(petNameSelectObject); 
      if(mumPetNames[p] === $scope.settings.mumPetName) {
        $scope.mumPetName = petNameSelectObject;
      }
    }
    $scope.$watch('mumPetName', function(petNameSelectObject) {
      $scope.settings.mumPetName = petNameSelectObject.text;
      $scope.settings.save();
    }, true);
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
  });

}());
