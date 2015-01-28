(function() {

  "use strict";

  var en = {
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
    "EMAIL_SUBJECT_SELECT": "Email Subject",
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
  };
  var fr = {
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
  };
  var es = {
    "SEND": "Enviar",
    "CANCEL": "Cancelar",
    "DONE": "Salir",
    "MUM_MOB": "N° telefónico de Mamá",
    "MUM_EMAIL": "Dirección mail de Mamá",
    "SND_EMAIL": "E-mail",
    "SND_SMS": "Texto",
    "SND_FACEBOOK": "Facebook",
    "MES_SEND_SUC": "Mensaje enviado",
    "MES_SEND_ERR": "Error de envío",
    "SMS_IMAGE_WARN": "Los SMS no permiten el envío de imágenes",
    "SEND_BY_EMAIL": "Enviar vía email",
    "SEND_TEXT_ONLY": "Enviar solo texto",
    "EOF_IMAGE": "¡Hasta mañana con nuevos gatitos!",
    "EOF_TEXT": "¡Hasta mañana con nuevos mensajes!",
    "SET_TAB_MUM": "Mamá",
    "SET_TAB_REM": "Recordatorios",
    "SET_TAB_MES": "Mensajes",
    "REFER_MUM": "Diminutivo para Mamá",
    "DAILY_REMINDER": "Recordatorio diario",
    "TIME_DAY": "Hora del día",
    "MES_PREF": "¿Qué tipo de mensajes le gustaría enviar?",
    "MES_PREF_NONE": "Ninguno",
    "MES_PREF_FEW": "Poco",
    "MES_PREF_MANY": "Mucho",
    "SEL_CONT": "Elegir en mis contactos",
    "INT_HOW":"¿Cómo estás ?",
    "INT_THINK": "Te pienso",
    "INT_JOKES": "Chistes",
    "INT_THANK": "Gracias",
    "INT_WORDS": "Palabritas para ti",
    "INT_LOVE": "Te amo",
    "INT_MISS": "Me haces falta",
    "INT_HERE": "Estoy contigo",
    "INT_FB": "Humor del día (fb)",
    "INT_POS": "Ideas positivas",
    "INT_DRINK": "Tomemos un café",
    "OTD_THOUGHT": "Idea del día",
    "OTD_JOKE": "Chiste del día",
    "EMAIL_SUBJECT": "Hola Mamá",
    "NOTIFICATION": "¿Un mensaje para Mamá? (¡nuevos gatitos!)"
  };
  angular.module('app/translation')
    .config(function($translateProvider) {
      $translateProvider.translations('en', en); 
      $translateProvider.translations('fr', fr); 
      $translateProvider.translations('es', es); 
      $translateProvider.fallbackLanguage('en');
      $translateProvider.determinePreferredLanguage();
    });

}());
