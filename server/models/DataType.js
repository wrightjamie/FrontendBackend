const db = require('../config/db');

/**
 * DataType Repository
 * Manages the schemas for dynamic data types.
 */
const DataType = {
    /**
     * findAll: Retrieve all data types sorted by name.
     */
    findAll: () => db.dataTypes.find({}).sort({ name: 1 }),

    /**
     * findOne: Retrieve a single data type by ID or query object.
     */
    findOne: (query) => {
        const q = typeof query === 'string' ? { _id: query } : query;
        return db.dataTypes.findOne(q);
    },

    /**
     * findBySlug: Retrieve a single data type by its URL slug.
     */
    findBySlug: (slug) => db.dataTypes.findOne({ slug }),

    /**
     * create: Create a new data type with default permissions.
     * Automatically generates a slug from the name if not provided.
     */
    create: async (typeData) => {
        const type = {
            ...typeData,
            slug: typeData.slug || typeData.name.toLowerCase().replace(/\s+/g, '-'),
            fields: typeData.fields || [],
            isOrdered: !!typeData.isOrdered,
            permissions: {
                canAdd: typeData.permissions?.canAdd !== false,
                canEdit: typeData.permissions?.canEdit !== false,
                canDelete: typeData.permissions?.canDelete !== false,
                canReorder: typeData.permissions?.canReorder !== false
            }
        };
        return await db.dataTypes.insert(type);
    },

    update: (id, updateData) => {
        const { _id, createdAt, updatedAt, ...cleanUpdate } = updateData;
        return db.dataTypes.update({ _id: id }, { $set: cleanUpdate }, { returnUpdatedDocs: true });
    },

    remove: (id) => db.dataTypes.remove({ _id: id })
};

module.exports = DataType;
