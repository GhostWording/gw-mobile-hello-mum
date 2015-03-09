(function() {

  "use strict";

  angular.module('app/state/home/send').controller('SendCtrl', function($scope, $state, config, settings, analytics, sendEmail, sendSMS) {
    // Close popup
    $scope.close = function() {
      $state.go('^');
    };
    // Send via SMS
    $scope.sendSMS = function() {
      $state.go('^.sendresult', {success: true});
      /*
      // If we have a mobile number 
      if($scope.mobileNumberValid()) {
        // Send the SMS
        sendSMS.setMobileNumber(settings.mobileNumber);
        sendSMS.send(prepareContentForSending()).then(function() {
          // Report SMS send
          analytics.reportEvent('Text', $scope.currentText.text.TextId, 'TextSelect', 'smssend');
          alert('GOING TO SEND SUCCESS STATE');
        }, function() {
          // Report SMS send fail
          analytics.reportEvent('Text', $scope.currentText.text.TextId, 'TextSelect', 'smssendfail');
          alert('GOING TO SEND ERROR STATE');
        }); 
      } else {
        alert('GOING TO SMS CONTACT SELECT STATE');
      }
      */
    };
    // Send via Email
    $scope.sendEmail = function() {
      // If we have a valid email address 
      if($scope.emailAddressValid()) {
        // Get the email subject
        $translate('EMAIL_SUBJECT_' + settings.emailSubjectIndex).then(function(emailSubject) {
          // Send the Email
          sendEmail.setEmailAddress(settings.emailAddress);
          sendEmail.setAttachmentPath($scope.currentImage);
          sendEmail.send(mumPetName.replace(emailSubject, settings.mumPetName), prepareContentForSending());
          // Report email send
          analytics.reportEvent('Text', $scope.currentText.text.TextId, 'TextSelect', 'emailsend');
        });
      } else {
        alert('GOING TO EMAIL CONTACT SELECT STATE');
      }
    };    
    // Send via Facebook
    $scope.sendFacebook = function() {
      // Hide the send popup
      $scope.sendPopupVisible = false;
      // Alert for now..
      // TODO: implement
      alert('sending "' + prepareContentForSending() + '" via Facebook');
    };
    // Returns true if the passed mobile number is valid
    // TODO: move to send 
    $scope.mobileNumberValid = function() {
      // TODO: make this better
      return settings.mobileNumber && settings.mobileNumber!=='';
    };
    // Returns true if the passed email is valid
    // TODO: move to send 
    $scope.emailAddressValid = function() {
      // TODO: make this better
      return settings.emailAddress && settings.emailAddress!=='';
    };
    // Prepare text content for sending 
    function prepareContentForSending() {
      // Get current text
      var text = $scope.currentText.text;
      // Get current text content
      var content = text.Content;
      // Add of the day labels
      if($scope.textIsThought(text)) content = $translate.instant('OTD_THOUGHT') + ' - ' + content;
      if($scope.textIsJoke(text)) content = $translate.instant('OTD_JOKE') + ' - ' + content;
      // Add author if quote
      if($scope.textIsQuote(text)) {
        content += ' - ' + text.Author;
      }
      // Return prepared content
      return content;
    }
    // Replace mother pet names
    function replacePetNames(textList, replacement) {
      if(textList) {
        for(var i=0; i<textList.length; i++) {
          textList[i].text.Content = mumPetName.replace(textList[i].text.Content, replacement); 
        }
      }
    }
  });

}());
