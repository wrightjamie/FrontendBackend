const Datastore = require('nedb-promises');
const db = Datastore.create({ inMemoryOnly: true });

async function test() {
    try {
        const doc = await db.insert({ name: 'test' });
        console.log('Inserted:', doc);

        const result = await db.update(
            { _id: doc._id },
            { $set: { name: 'updated' } },
            { returnUpdatedDocs: true }
        );

        console.log('Update Result Type:', typeof result);
        console.log('Is Array:', Array.isArray(result));
        console.log('Update Result:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error(err);
    }
}

test();
