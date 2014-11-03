(function() {

  "use strict";

  angular.module('app/text/textlist').controller('TextListCtrl', function($scope, areasSvc, intentionsSvc, textsSvc, filteredTextListSvc, filtersSvc) {
    localStorage.clear();
    // Fetch areas
    areasSvc.getAll().then(function(areas) {
      $scope.areas = areas;
    });
    // Areas ready
    $scope.areasReady = function() {
      return $scope.areas && $scope.areas.length > 0;
    };
    // Area selected
    $scope.areaSelected = function() {
      // Set current area
      areasSvc.setCurrentName($scope.area.Name); 
      // Clear intentions
      $scope.intentions = null;
      // Clear texts
      $scope.texts = null;
      // Get intentions for area
      intentionsSvc.getIntentionsForArea($scope.area.Name).then(function(intentions) {
        console.log(intentions);
        $scope.intentions = intentions;
      });
    };
    // Intentions Ready
    $scope.intentionsReady = function() {
      return $scope.intentions && $scope.intentions.length > 0;
    };
    // Intention selected
    $scope.intentionSelected = function() {
      // Set current intention
      intentionsSvc.setIntentionSlug($scope.intention.Slug); 
      // Clear texts
      $scope.texts = null;
      // Reset genders
      $scope.gender = 'any';
      $scope.recipientGender = 'any';
      // Fetch texts
      textsSvc.getCurrentTextList('en-EN').then(function(texts) {
        $scope.texts = texts;
        $scope.filteredTexts = texts;
      }); 
    };
    // Filtering
    function filterTexts() {
      var filters = filtersSvc.filters; 
      var user = {};
      switch($scope.gender) {
        case 'any': user.gender = 'I'; break;
        case 'male': user.gender = 'N'; break;
        case 'female': user.gender = 'F'; break;
      }
      switch($scope.recipientGender) {
        case 'any': filters.recipientGender = 'I'; break;
        case 'male': filters.recipientGender = 'N'; break;
        case 'female': filters.recipientGender = 'F'; break;
      }
      filteredTextListSvc.setFilteredAndOrderedList($scope.texts, user, filters.preferredStyles);
      $scope.filteredTexts = filteredTextListSvc.getFilteredTextList();
    }
    // Gender selected
    $scope.genderSelected = function() {
      filterTexts();
    };
    // Recipient Gender selected
    $scope.recipientGenderSelected = function() {
      filterTexts();
    };
    // Texts Ready
    $scope.textsReady = function() {
      return $scope.texts && $scope.texts.length > 0;
    };
  });

}());
