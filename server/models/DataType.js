const db = require('../config/db');

/**
 * DataType Repository
 * Manages the schemas for dynamic data types.
 */
const DataType = {
    findAll: () => db.dataTypes.find({}).sort({ name: 1 }),

    findOne: (id) => db.dataTypes.findOne({ _id: id }),

    findBySlug: (slug) => db.dataTypes.findOne({ slug }),

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
