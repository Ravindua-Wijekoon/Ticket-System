const jwt = require('jsonwebtoken');

// Middleware to authenticate and verify the JWT token
exports.authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        console.log("Authorization denied: No token provided");
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the token
        req.user = decoded; // Attach decoded user info to req.user
        next();
    } catch (err) {
        console.log("Token verification error:", err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired. Please log in again.' });
        }
        return res.status(401).json({ error: 'Token is not valid' }); // Return error if token is invalid
    }
};

// Middleware to allow access only for users with vendor role
exports.vendorOnly = (req, res, next) => {
    if (!req.user) {
        console.log("Unauthorized access: No user data found");
        return res.status(401).json({ error: 'Unauthorized access' });
    }

    if (req.user.userType !== 'vendor') {
        console.log("Access denied: User is not a vendor");
        return res.status(403).json({ error: 'Access restricted to vendors' });
    }

    next();
};

// Middleware to allow access only for users with customer role
exports.customerOnly = (req, res, next) => {
    if (!req.user) {
        console.log("Unauthorized access: No user data found");
        return res.status(401).json({ error: 'Unauthorized access' });
    }

    if (req.user.userType !== 'customer') {
        console.log("Access denied: User is not a customer");
        return res.status(403).json({ error: 'Access restricted to customers' });
    }

    next();
};

