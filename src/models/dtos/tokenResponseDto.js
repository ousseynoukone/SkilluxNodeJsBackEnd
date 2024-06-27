// Function to get user response
const {ACCESS_TOKEN_EXPIRE,REFRESH_TOKEN_EXPIRE} = require("../../parameters/constants")

const {convertToExpireDate} = require('../../controllers/auth/helper')
function getLoginResponseDto(user, token,refresh_token) {
    return {
        access_token: token,
        access_token_expire: convertToExpireDate(ACCESS_TOKEN_EXPIRE), 
        refresh_token_expire: convertToExpireDate(REFRESH_TOKEN_EXPIRE), 
        refresh_token: refresh_token,
        user:user
    };
}

function getRefreshTokenDto(token,refresh_token) {
    return {
        access_token: token,
        access_token_expire: convertToExpireDate(ACCESS_TOKEN_EXPIRE), 
        refresh_token_expire: convertToExpireDate(REFRESH_TOKEN_EXPIRE), 
        refresh_token: refresh_token,
    };
}

module.exports = {getLoginResponseDto,getRefreshTokenDto};
