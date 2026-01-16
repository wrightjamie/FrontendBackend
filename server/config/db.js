const Datastore = require('nedb-promises');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

const createDatastore = (filename) => {
    return Datastore.create({
        filename: path.join(DATA_DIR, filename),
        autoload: true,
        timestampData: true
    });
};

const db = {
    users: createDatastore('users.db'),
};

console.log(`[Database] NeDB initialized in ${DATA_DIR}`);

module.exports = db;
