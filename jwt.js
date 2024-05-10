const jwt = require('jsonwebtoken');

const jwt_secret = '1234'; 

const jwtAuthMiddleWare = (req, res, next) => {
    // Extract the JWT token from the request header
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, jwt_secret);
        // Attach user information to the request object
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Function to generate JWT token
const generateToken = (userData) => {
    // Generate a new JWT token using user data
    return jwt.sign(userData, jwt_secret,{expiresIn:'30'})
};

module.exports = { jwtAuthMiddleWare, generateToken };
