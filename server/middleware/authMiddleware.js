const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    console.log("Token from header:", token);

    if (!token) {
        console.log("No token sent in request");
        return res.json(401).json({ message: "No Token, Not Authorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT payload:", decoded);

        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = user;
        console.log("req.user set in middleware:", req.user);

        next();
    } catch (error) {
        console.log("Token verification failed:", error.message);
        
        res.status(401).json({ message: 'Token Failed' });
    }
};

exports.authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.json({ message: 'Access Denied' });
        }
        next();
    }
}