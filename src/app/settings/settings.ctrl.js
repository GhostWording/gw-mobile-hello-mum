(function() {

  "use strict";

  angular.module('app/settings').controller('SettingsCtrl', function($window, $scope, config, notification, analytics, mumPetName) {
    // Report settings page init
    analytics.reportEvent('Init', 'Page', 'Settings', 'Init');        
    // Get device width and height
    // TODO: move into service
    $scope.deviceWidth = $window.deviceWidth;    
    $scope.deviceHeight = $window.deviceHeight;    
    $scope.ddSelectOptions = [
        {
            text: 'Option1',
            iconCls: 'someicon'
        },
        {
            text: 'Option2',
            someprop: 'somevalue'
        },
        {
            // Any option with divider set to true will be a divider
            // in the menu and cannot be selected.
            divider: true
        },
        {
            // Example of an option with the 'href' property
            text: 'Option4',
            href: '#option4'
        }
    ];

    $scope.ddSelectSelected = {};
    // Intentions
    $scope.intentions = [
      {name: 'how-are-you', label:'How Are You'},
      {name: 'I-think-of-you', label:'Thinking Of You'},
      {name: 'jokes', label:'Jokes'},
      {name: 'thank-you', label:'Thank You'},
      {name: 'a-few-words-for-you', label:'A Few Words For You'},
      {name: 'I-love-you', label:'I Love You'},
      {name: 'I-miss-you', label:'I Miss You'},
      {name: 'I-am-here-for-you', label:'Here For You'},
      {name: 'facebook-status', label:'Facebook Status'},
      {name: 'positive-thoughts', label:'Poisitive Thoughts'},
      {name: 'would-you-care-for-a-drink', label:'Care For A Drink?'}
    ];
    // Mum pet names
    var mumPetNames = mumPetName.getNames();
    $scope.mumPetNames = [];
    for(var p=0; p<mumPetNames.length; p++) {
      $scope.mumPetNames.push({text:mumPetNames[p]}); 
    }
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
        notification.set($scope.settings.notificationHour, $scope.settings.notificationMinute, mumPetName.replace(config.notificationMessage, $scope.settings.mumPetName));
      } else {
        // Report notification disabled
        analytics.reportEvent('Command', 'NotificationDisabled', 'Settings', 'click');        
        // Clear notification
        notification.clear();
      }
    };
  });

}());
