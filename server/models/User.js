const db = require('../config/db');

/**
 * User Repository
 * Abstracts the database logic for Users.
 * Using nedb-promises for built-in async/await support.
 */
const User = {
    find: (query = {}) => db.users.find(query),

    findOne: (query) => db.users.findOne(query),

    /**
     * create: Create a new user with email, status, and timestamps.
     * @param {object} userData - User data including username, password, role, email, status
     */
    create: async (userData) => {
        const now = new Date().toISOString();
        const user = {
            ...userData,
            role: userData.role || 'viewer',
            status: userData.status || 'active', // active, pending, suspended
            email: userData.email || null,
            createdAt: now,
            updatedAt: now,
            active: true // Keep for backward compatibility
        };
        return await db.users.insert(user);
    },

    /**
     * update: Update an existing user.
     * @param {string} id - User ID
     * @param {object} updateData - Fields to update
     */
    update: async (id, updateData) => {
        const now = new Date().toISOString();

        // Remove fields that shouldn't be updated directly
        const { _id, createdAt, ...cleanUpdate } = updateData;

        // Add updatedAt timestamp
        cleanUpdate.updatedAt = now;

        return await db.users.update(
            { _id: id },
            { $set: cleanUpdate },
            { returnUpdatedDocs: true }
        );
    },

    remove: (query) => db.users.remove(query, { multi: true })
};

module.exports = User;
