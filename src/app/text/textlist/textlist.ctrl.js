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
      // Fetch texts
      textsSvc.getCurrentTextList('en-EN').then(function(texts) {
        $scope.texts = texts;
      }); 
    };
    // Filtering
    var user = {};
    function filterTexts() {
      filteredTextListSvc.setFilteredAndOrderedList($scope.texts, user, filtersSvc.filters.preferredStyles);
      $scope.filteredTexts = filteredTextListSvc.getFilteredTextList();
    }
    // Gender selected
    $scope.genderSelected = function() {
      if($scope.gender == 'male') user.gender = 'I';
      if($scope.gender == 'female') user.gender = 'F';
      console.log(user);
      filterTexts();
    };
    // Texts Ready
    $scope.textsReady = function() {
      return $scope.texts && $scope.texts.length > 0;
    };
  });

}());
