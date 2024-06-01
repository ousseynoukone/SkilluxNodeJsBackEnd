require('dotenv').config(); // Load environment variables from .env file
const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../../models/BlacklistedToken');
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const authenticateToken = async (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    
    // Check if the header is present
    if (!authHeader) {
        return res.sendStatus(401); // Unauthorized if no header is found
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1];

    // Check if the token is present
    if (!token) {
        return res.sendStatus(401); // Unauthorized if no token is found
    }

    // Check if the token is blacklisted
    const blacklistedToken = await BlacklistedToken.findOne({ where: { token: token } });
    if (blacklistedToken) {
      return res.status(403).json({ error: 'Token is blacklisted' });
    }

    // Verify the token using the secret
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    error: 'Token has expired',
                    expiredAt: err.expiredAt
                });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ error: 'Invalid token: ' + err.message });
            } else {
                return res.status(403).json({ error: 'Invalid token' });
            }
        }

        // Calculate token expiration details
        const expirationDate = new Date(decoded.exp * 1000);
        const expirationISO = expirationDate.toISOString();
        const expirationMs = expirationDate.getTime();

        // Calculate time left in seconds
        const nowMs = new Date().getTime();
        const timeLeftMs = Math.max(0, expirationMs - nowMs);
        const timeLeftSeconds = Math.floor(timeLeftMs / 1000);

        // Reconstruct user object with token and expiration info
        const user = {
            ...decoded, // This spreads all claims from the token
            token: token,
            tokenExpirationSecondsLeft: timeLeftSeconds
        };

        // Attach enhanced user information to the request object
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;