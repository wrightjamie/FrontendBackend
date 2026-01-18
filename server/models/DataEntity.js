const db = require('../config/db');

/**
 * DataEntity Repository
 * Manages the actual data records linked to a DataType.
 */
const DataEntity = {
    findByType: (typeId) => db.dataEntities.find({ typeId }).sort({ order: 1, createdAt: 1 }),

    findOne: (id) => db.dataEntities.findOne({ _id: id }),

    create: async (typeId, entityData) => {
        // If ordered, find the max order and increment
        let order = 0;
        const entities = await db.dataEntities.find({ typeId }).sort({ order: -1 }).limit(1);
        if (entities.length > 0) {
            order = entities[0].order + 1;
        }

        const entity = {
            ...entityData,
            typeId,
            order
        };
        return await db.dataEntities.insert(entity);
    },

    update: (id, updateData) => {
        const { _id, typeId, createdAt, updatedAt, ...cleanUpdate } = updateData;
        return db.dataEntities.update({ _id: id }, { $set: cleanUpdate }, { returnUpdatedDocs: true });
    },

    remove: (id) => db.dataEntities.remove({ _id: id }),

    updateOrder: async (id, newOrder) => {
        return await db.dataEntities.update({ _id: id }, { $set: { order: newOrder } });
    },

    // Bulk update for reordering
    reorder: async (updates) => {
        // updates = [{ id, order }, ...]
        const promises = updates.map(u =>
            db.dataEntities.update({ _id: u.id }, { $set: { order: u.order } })
        );
        return await Promise.all(promises);
    }
};

module.exports = DataEntity;
