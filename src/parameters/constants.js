const minimumAge = 12
// One week in miliseconds
const cleanUpNotificationDate = 7 * 24 * 60 * 60 * 1000;

// Api Auth Token Expiration
const ACCESS_TOKEN_EXPIRE = "1d";
const REFRESH_TOKEN_EXPIRE = "30d"; 

module.exports = {minimumAge,cleanUpNotificationDate,ACCESS_TOKEN_EXPIRE,REFRESH_TOKEN_EXPIRE}