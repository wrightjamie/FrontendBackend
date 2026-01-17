const User = require('../models/User');

/**
 * isAuthenticated: Middleware to ensure user is logged in
 */
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.status(401).json({ message: 'Authentication required' });
};

/**
 * isAdmin: Middleware to ensure user has admin role
 */
const isAdmin = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const user = await User.findOne({ _id: req.session.userId });
        if (user && user.role === 'admin') {
            return next();
        }
        res.status(403).json({ message: 'Admin privileges required' });
    } catch (err) {
        res.status(500).json({ message: 'Server error during authorization' });
    }
};

module.exports = {
    isAuthenticated,
    isAdmin
};
