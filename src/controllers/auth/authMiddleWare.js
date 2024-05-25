require('dotenv').config(); // Load environment variables from .env file
const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const authenticateToken = (req, res, next) => {
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

    // Verify the token using the secret
    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden if token is invalid
        }

        // Attach user information to the request object
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;
