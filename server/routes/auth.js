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

        // Return all user fields except password
        const { password: hashedPwd, ...userWithoutPassword } = user;

        res.status(201).json({
            user: userWithoutPassword
        });
    } catch (err) {
        res.status(500).json({ message: 'Setup failed' });
    }
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (pending approval)
 */
router.post('/register', async (req, res) => {
    try {
        const { username, name, email, password } = req.body;

        // Validation
        if (!username || !name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with pending status
        const user = await User.create({
            username,
            name,
            email,
            password: hashedPassword,
            role: 'viewer',
            status: 'pending'
        });

        res.status(201).json({
            message: 'Registration successful! Your account is pending admin approval.',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                status: user.status
            }
        });
    } catch (err) {
        console.error('Error in /register:', err);
        res.status(500).json({ message: 'Registration failed' });
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

        // Check user status
        if (user.status === 'pending') {
            return res.status(403).json({
                message: 'Your account is pending admin approval. Please wait for activation.'
            });
        }

        if (user.status === 'suspended') {
            return res.status(403).json({
                message: 'Your account has been suspended. Please contact an administrator.'
            });
        }

        req.session.userId = user._id;

        // Return all user fields except password
        const { password: userPassword, ...userWithoutPassword } = user;

        res.json({
            user: userWithoutPassword
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

        // Return all user fields except password
        const { password, ...userWithoutPassword } = user;

        res.json({
            user: userWithoutPassword
        });
    } catch (err) {
        res.status(500).json({ message: 'Session error' });
    }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update logged-in user's profile (name, email)
 */
router.put('/profile', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if email is already taken by another user
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id !== req.session.userId) {
            return res.status(400).json({ message: 'Email already in use by another account' });
        }

        // Update user profile
        const updatedUser = await User.update(req.session.userId, { name, email });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...userWithoutPassword } = updatedUser;

        res.json({
            message: 'Profile updated successfully',
            user: userWithoutPassword
        });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password for logged-in user
 */
router.post('/change-password', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new passwords are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        // Get current user
        const user = await User.findOne({ _id: req.session.userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update(user._id, { password: hashedPassword });

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ message: 'Failed to change password' });
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
