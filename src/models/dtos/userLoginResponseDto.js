// Function to get user response
function getUserResponse(user) {
    return {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePicture: user.profilePicture,
    };
}

module.exports =  getUserResponse