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
        return res.status(401).json({ message: "No Token, Not Authorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT payload:", decoded);

        const user = await User.findById(decoded.id).populate("role", "name");
        if (!user) return res.status(401).json({ message: "User not found" });

        if (!user.activeSessionId || user.activeSessionId !== decoded.sessionId) {
            return res.status(401).json({
                message: "Session expired. Please login again."
            });
        }

        req.user = user;
        console.log("req.user set in middleware:", req.user);

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {

            const decoded = jwt.decode(token);

            if (decoded?.id) {
                await User.findByIdAndUpdate(decoded.id, {
                    activeSessionId: null,
                    isLoggedIn: false
                });
            }

            return res.status(401).json({
                message: "Session expired. Please login again."
            });
        }

        return res.status(401).json({ message: "Token invalid" });
    }


    exports.authorizedRoles = (...roles) => {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return res.json({ message: 'Access Denied' });
            }
            next();
        }
    }
}