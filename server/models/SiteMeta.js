const Datastore = require('nedb-promises');
const path = require('path');
const mediaConfig = require('../config/mediaConfig');

// Site meta is stored in its own small DB
const siteMetaDb = process.env.NODE_ENV === 'test'
    ? Datastore.create({ inMemoryOnly: true })
    : Datastore.create({
        filename: path.join(__dirname, '../data/sitemeta.db'),
        autoload: true,
    });

const SiteMeta = {
    async get() {
        // We only ever want one record
        const meta = await siteMetaDb.findOne({});
        const defaults = {
            title: 'App Name',
            description: 'Welcome to the application',
            maintenanceMode: false,
            maintenanceMessage: 'The site is currently under maintenance. Please try again later.'
        };

        if (!meta) return defaults;

        // Ensure maintenance fields and media config are present
        return {
            ...defaults,
            ...meta,
            mediaConfig: {
                responsive: mediaConfig.responsive
            }
        };
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
