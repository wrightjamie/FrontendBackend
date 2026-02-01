const db = require('../config/db');

/**
 * DataEntity Repository
 * Manages the actual data records linked to a DataType.
 */
const DataEntity = {
    /**
     * findByType: Retrieve all records for a specific type, sorted by order and date.
     */
    findByType: (typeId) => db.dataEntities.find({ typeId }).sort({ order: 1, createdAt: 1 }),

    /**
     * findOne: Retrieve a single record by ID.
     */
    findOne: (id) => db.dataEntities.findOne({ _id: id }),

    /**
     * create: Create a new record and assign it the next available order index if applicable.
     */
    create: async (typeId, entityData) => {
        // If ordered, find the max order and increment
        let order = 0;
        const entities = await db.dataEntities.find({ typeId }).sort({ order: -1 }).limit(1);
        if (entities.length > 0) {
            order = (entities[0].order || 0) + 1;
        }

        const entity = {
            ...entityData,
            typeId,
            order
        };
        return await db.dataEntities.insert(entity);
    },

    /**
     * update: Update a record by ID, removing non-updatable fields from the payload.
     */
    update: (id, updateData) => {
        const { _id, typeId, createdAt, updatedAt, ...cleanUpdate } = updateData;
        return db.dataEntities.update({ _id: id }, { $set: cleanUpdate }, { returnUpdatedDocs: true });
    },

    /**
     * remove: Delete a record by ID.
     */
    remove: (id) => db.dataEntities.remove({ _id: id }),

    /**
     * updateOrder: Update the order index of a specific record.
     */
    updateOrder: async (id, newOrder) => {
        return await db.dataEntities.update({ _id: id }, { $set: { order: newOrder } });
    },

    /**
     * findPaginated: Retrieve a page of records for a specific type.
     */
    findPaginated: async (typeId, page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            db.dataEntities.find({ typeId }).sort({ order: 1, createdAt: 1 }).skip(skip).limit(limit),
            db.dataEntities.count({ typeId })
        ]);

        return {
            data,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
        };
    },

    reorder: async (updates) => {
        const promises = updates.map(u =>
            db.dataEntities.update({ _id: u.id }, { $set: { order: u.order } })
        );
        return await Promise.all(promises);
    }
};

module.exports = DataEntity;
