// middleware/authMiddleware.js
require('dotenv').config(); // Load environment variables from .env file
const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;


const authenticateToken = (req, res, next) => {
   
    const token =  req.headers['authorization'];
    if (!token) {
        return res.sendStatus(401); // Unauthorized if no token is found
    }

    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden if token is invalid
        }

        req.user = user; // Attach user information to the request object
        next(); // Proceed to the next middleware or route handler
    });
};


module.exports = authenticateToken