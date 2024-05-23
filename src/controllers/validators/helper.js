const minimumAge = require("../../parameters/constants");

function isOldEnough(dateString) {
    const [day, month, year] = dateString.split('-').map(Number);
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

module.exports = isOldEnough;
