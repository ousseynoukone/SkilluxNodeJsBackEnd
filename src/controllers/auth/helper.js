const {minimumAge} = require("../../parameters/constants");
const os = require('os');
require('dotenv').config(); // Load environment variables from .env file
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME;
const PORT = (process.env.PORT && process.env.PORT.trim() !== "") ? process.env.PORT : 5050;
const BASE_ENDPOINT = (process.env.BASE_ENDPOINT && process.env.BASE_ENDPOINT.trim() !== "") ? process.env.BASE_ENDPOINT : "/api/v1";


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
function convertToExpireDate(timeStr) {
  // Regular expression to match the pattern of the string
  const regExp = /^(\d+)([smhd])$/;
  const match = timeStr.match(regExp);

  if (match) {
    // Extract the number and the unit from the match
    const value = parseInt(match[1]);
    const unit = match[2];

    let seconds;

    switch (unit) {
      case 's':
        seconds = value; // already in seconds
        break;
      case 'm':
        seconds = value * 60; // convert minutes to seconds
        break;
      case 'h':
        seconds = value * 3600; // convert hours to seconds
        break;
      case 'd':
        seconds = value * 86400; // convert days to seconds
        break;
      default:
        throw new Error('Invalid time unit');
    }

    // Calculate the expire date
    const expireDate = new Date(Date.now() + seconds * 1000);

    // Return the ISO string representation of the expire date
    return expireDate.toISOString();
  } else {
    throw new Error('Invalid time format');
  }
}

function getServerHostNameOrIp() {

  if(SERVER_HOSTNAME != undefined && SERVER_HOSTNAME.length>0){
   let server_host = SERVER_HOSTNAME;

    return `${server_host}:${PORT}${BASE_ENDPOINT}/`;
  }else{

    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
      const interfaceInfo = networkInterfaces[interfaceName];
      for (const info of interfaceInfo) {
        if (info.family === 'IPv4' && !info.internal) {
         
         return  `http://${info.address}:${PORT}${BASE_ENDPOINT}/`;

        }
      }
    }
  }

 


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

module.exports = {isOldEnough,convertToExpireDate,getServerHostNameOrIp,getLoginErrorMessage};




