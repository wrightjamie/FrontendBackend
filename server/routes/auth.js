const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * @route   GET /api/auth/needs-setup
 * @desc    Check if any admin user exists
 */
router.get('/needs-setup', async (req, res) => {
    try {
        const admin = await User.findOne({ role: 'admin' });
        res.json({ needsSetup: !admin });
    } catch (err) {
        console.error('Error in /needs-setup:', err);
        res.status(500).json({ message: 'Server error check setup' });
    }
});

/**
 * @route   POST /api/auth/setup
 * @desc    Create first admin account
 */
router.post('/setup', async (req, res) => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            return res.status(400).json({ message: 'Setup already completed' });
        }

        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password: hashedPassword,
            role: 'admin'
        });

        req.session.userId = user._id;
        res.status(201).json({
            user: { id: user._id, username: user.username, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: 'Setup failed' });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and start session
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        req.session.userId = user._id;
        res.json({
            user: { id: user._id, username: user.username, role: user.role }
        });
    } catch (err) {
        console.error('Error in /login:', err);
        res.status(500).json({ message: 'Login failed' });
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 */
router.get('/me', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        const user = await User.findOne({ _id: req.session.userId });
        if (!user) return res.status(401).json({ message: 'User not found' });

        res.json({
            user: { id: user._id, username: user.username, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: 'Session error' });
    }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Destroy session
 */
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out' });
    });
});

module.exports = router;
