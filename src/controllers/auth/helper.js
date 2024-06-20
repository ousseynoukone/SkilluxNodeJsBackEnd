const {minimumAge} = require("../../parameters/constants");

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

module.exports = {isOldEnough,convertToSeconds};




