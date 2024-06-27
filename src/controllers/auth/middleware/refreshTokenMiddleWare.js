require('dotenv').config(); // Load environment variables from .env file
const jwt = require('jsonwebtoken');
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const refreshTokenMiddleWare = async (req, res, next) => {
    // Extract the token from the Authorization header
    const refreshToken = req.body.refresh_token

    if(!refreshToken){
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify the token using the secret
    jwt.verify(refreshToken, refreshTokenSecret, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    error: 'Refresh Token has expired',
                    expiredAt: err.expiredAt
                });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ error: 'Invalid refresh token: ' + err.message });
            } else {
                return res.status(403).json({ error: 'Invalid refresh token' });
            }
        }

        // Reconstruct user object with token and expiration info
        const user = {
            ...decoded, // This spreads all claims from the token
        };

        // Attach enhanced user information to the request object
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = refreshTokenMiddleWare;