const Datastore = require('nedb-promises');
const path = require('path');

const dbPath = path.join(__dirname, '../data/media.db');
const mediaDb = Datastore.create(dbPath);

const Media = {
    async create(data) {
        return await mediaDb.insert({
            ...data,
            createdAt: new Date()
        });
    },

    async findAll() {
        return await mediaDb.find({}).sort({ createdAt: -1 });
    },

    async findOne(id) {
        return await mediaDb.findOne({ _id: id });
    },

    async update(id, data) {
        return await mediaDb.update({ _id: id }, { $set: data }, { returnUpdatedDocs: true });
    },

    async remove(id) {
        return await mediaDb.remove({ _id: id }, {});
    }
};

module.exports = Media;
