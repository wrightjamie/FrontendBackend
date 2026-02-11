const SiteMeta = require('../models/SiteMeta');
const User = require('../models/User');

/**
 * maintenanceMiddleware: Blocks non-admin requests if maintenance mode is active.
 */
const maintenanceMiddleware = async (req, res, next) => {
    // 1. Fetch current site metadata
    const meta = await SiteMeta.get();

    // 2. If maintenance mode is not active, proceed
    if (!meta.maintenanceMode) {
        return next();
    }

    // 3. Allow essential API paths even in maintenance mode
    const allowedPaths = [
        '/api/site/meta',
        '/api/auth/me',
        '/api/auth/login',
        '/api/auth/logout',
        '/uploads'
    ];

    if (allowedPaths.some(path => req.path.startsWith(path))) {
        return next();
    }

    // 4. Check if the user is an administrator
    if (req.session.userId) {
        try {
            const user = await User.findOne({ _id: req.session.userId });
            if (user && user.role === 'admin') {
                // Admins are allowed to bypass maintenance mode
                return next();
            }
        } catch (err) {
            console.error('Error in maintenance middleware:', err);
        }
    }

    // 5. Block all other requests
    res.status(503).json({
        message: meta.maintenanceMessage || 'The site is currently under maintenance. Please try again later.',
        isMaintenance: true
    });
};

module.exports = maintenanceMiddleware;
