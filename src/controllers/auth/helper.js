const {minimumAge} = require("../../parameters/constants");
const os = require('os');

function isOldEnough(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Check if the birth date has not occurred yet this year
    const birthMonthDayHasPassed = (today.getMonth() > birthDate.getMonth()) || 
                                   (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    
    if (!birthMonthDayHasPassed) {
        age--;
    }
    return age >= minimumAge;
}
function convertToSeconds(timeStr) {
  // Regular expression to match the pattern of the string
  const regExp = /^(\d+)([smhd])$/;
  const match = timeStr.match(regExp);

  if (match) {
    // Extract the number and the unit from the match
    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value; // already in seconds
      case 'm':
        return value * 60; // convert minutes to seconds
      case 'h':
        return value * 3600; // convert hours to seconds
      case 'd':
        return value * 86400; // convert days to seconds
      default:
        throw new Error('Invalid time unit');
    }
  } else {
    throw new Error('Invalid time format');
  }
}


function getServerIP() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const interfaceInfo = networkInterfaces[interfaceName];
    for (const info of interfaceInfo) {
      if (info.family === 'IPv4' && !info.internal) {
        return info.address;
      }
    }
  }
  return '127.0.0.1'; // Default to localhost if no external IP is found
}


// Function to get error messages based on language and error type
function getLoginErrorMessage(errorType, lang) {
  const messages = {
    usernameOrEmailRequired: {
      en: 'At least one among username and email should be provided',
      fr: 'Au moins un parmi le nom d\'utilisateur et l\'adresse e-mail doit être fourni',
    },
    userNotFound: {
      en: 'You do not exist in our records',
      fr: 'Vous n\'existez pas dans nos enregistrements',
    },
    accountDeactivated: {
      en: 'Account deactivated',
      fr: 'Compte désactivé',
    },
    loginPasswordIncorrect: {
      en: 'Login or/and Password incorrect',
      fr: 'Nom d\'utilisateur ou mot de passe incorrect',
    },
  };

  return messages[errorType][lang] || messages[errorType]['en']; // Default to English if language is not defined
}

module.exports = {isOldEnough,convertToSeconds,getServerIP,getLoginErrorMessage};




