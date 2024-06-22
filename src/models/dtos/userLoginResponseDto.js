// Function to get user response
function getLoginResponseDto(user, token, expire) {
    // Calculate the expiration date
    const expireDate = new Date(Date.now() + expire * 1000);
    
    return {
        token: token,
        expire: expireDate.toISOString(), // Return as an ISO string
        user:user
    };
}

module.exports = getLoginResponseDto;
