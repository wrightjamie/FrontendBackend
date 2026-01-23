const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { isAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 */
router.get('/', isAdmin, async (req, res) => {
    try {
        const users = await User.find({});

        // Remove password from response
        const sanitizedUsers = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.json(sanitizedUsers);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

/**
 * @route   GET /api/users/pending-count
 * @desc    Get count of pending users (admin only)
 */
router.get('/pending-count', isAdmin, async (req, res) => {
    try {
        const pendingUsers = await User.find({ status: 'pending' });
        res.json({ count: pendingUsers.length });
    } catch (err) {
        console.error('Error fetching pending count:', err);
        res.status(500).json({ message: 'Failed to fetch pending count' });
    }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update user details (admin only)
 */
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Don't allow password updates through this endpoint
        if (updateData.password) {
            return res.status(400).json({ message: 'Use password reset endpoint to change passwords' });
        }

        const updatedUser = await User.update(id, updateData);

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...userWithoutPassword } = updatedUser;

        res.json(userWithoutPassword);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Failed to update user' });
    }
});

/**
 * @route   PUT /api/users/:id/approve
 * @desc    Approve a pending user (admin only)
 */
router.put('/:id/approve', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const updatedUser = await User.update(id, { status: 'active' });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...userWithoutPassword } = updatedUser;

        res.json({
            message: 'User approved successfully',
            user: userWithoutPassword
        });
    } catch (err) {
        console.error('Error approving user:', err);
        res.status(500).json({ message: 'Failed to approve user' });
    }
});

/**
 * @route   PUT /api/users/:id/password
 * @desc    Admin sets user password (admin only)
 */
router.put('/:id/password', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.update(id, { password: hashedPassword });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ message: 'Failed to update password' });
    }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user (admin only)
 */
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent admin from deleting themselves
        if (req.session.userId === id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        const numRemoved = await User.remove({ _id: id });

        if (numRemoved === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Failed to delete user' });
    }
});

module.exports = router;
