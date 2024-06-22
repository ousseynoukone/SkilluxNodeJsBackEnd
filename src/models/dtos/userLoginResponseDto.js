// Function to get user response
function getLoginResponseDto(user,token,expire) {
    return {
        id: user.id,
        token: token,
        expire: expire,
    };
}

module.exports =  getLoginResponseDto