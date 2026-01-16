const db = require('../config/db');

/**
 * User Repository
 * Abstracts the database logic for Users.
 * Using nedb-promises for built-in async/await support.
 */
const User = {
    find: (query = {}) => db.users.find(query),

    findOne: (query) => db.users.findOne(query),

    create: async (userData) => {
        const user = {
            ...userData,
            role: userData.role || 'viewer',
            active: true
        };
        return await db.users.insert(user);
    },

    remove: (query) => db.users.remove(query, { multi: true })
};

module.exports = User;
