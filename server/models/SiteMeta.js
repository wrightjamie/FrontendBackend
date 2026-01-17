const Datastore = require('nedb-promises');
const path = require('path');

// Site meta is stored in its own small DB
const siteMetaDb = Datastore.create({
    filename: path.join(__dirname, '../data/sitemeta.db'),
    autoload: true,
});

const SiteMeta = {
    async get() {
        // We only ever want one record
        const meta = await siteMetaDb.findOne({});
        return meta || { title: 'Vantage', description: 'Your Standard Data Highway' };
    },

    async update(data) {
        const current = await this.get();
        if (current._id) {
            return await siteMetaDb.update({ _id: current._id }, { ...current, ...data }, { returnUpdatedDocs: true });
        } else {
            return await siteMetaDb.insert(data);
        }
    }
};

module.exports = SiteMeta;
