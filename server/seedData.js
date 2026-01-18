const DataType = require('./models/DataType');
const DataEntity = require('./models/DataEntity');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const seedData = async () => {
    try {
        console.log('[Seed] Starting idempotent database seeding...');

        // Helper to find or create a data type
        const getOrCreateType = async (typeConfig) => {
            let type = await DataType.findOne({ slug: typeConfig.slug });
            if (!type) {
                console.log(`[Seed] Creating data type: ${typeConfig.name}`);
                type = await DataType.create(typeConfig);
                await wait(100); // Give file system a moment
            } else {
                console.log(`[Seed] Data type already exists: ${typeConfig.name}`);
            }
            return type;
        };

        // 1. Setup Brands
        const brands = await getOrCreateType({
            name: 'Brands',
            slug: 'brands',
            description: 'Top technology brands',
            isOrdered: true,
            fields: [
                { name: 'Name', type: 'text', description: 'Brand name', required: true },
                { name: 'Website', type: 'text', description: 'Official website URL', required: false },
                { name: 'Is Featured', type: 'boolean', description: 'Highlight this brand', defaultValue: false }
            ]
        });

        // 2. Setup Categories
        const categories = await getOrCreateType({
            name: 'Categories',
            slug: 'categories',
            description: 'Product categories',
            isOrdered: false,
            fields: [
                { name: 'Title', type: 'text', description: 'Category title', required: true },
                { name: 'Description', type: 'text', description: 'Category description', required: false }
            ]
        });

        // 3. Setup System Logs
        const logs = await getOrCreateType({
            name: 'System Logs',
            slug: 'system-logs',
            description: 'System-generated event logs (Read/Edit Only)',
            isOrdered: false,
            permissions: { canAdd: false, canEdit: true, canDelete: false },
            fields: [
                { name: 'Timestamp', type: 'date', description: 'When the event occurred', required: true },
                { name: 'Event', type: 'text', description: 'Event description', required: true },
                { name: 'Resolved', type: 'boolean', description: 'Whether the issue is fixed', defaultValue: false }
            ]
        });

        // Seed Entities if empty for each type
        const seedEntities = async (typeId, entitiesArray, label) => {
            const existing = await DataEntity.findByType(typeId);
            if (existing.length === 0) {
                console.log(`[Seed] Seeding records for ${label}...`);
                for (const entity of entitiesArray) {
                    await DataEntity.create(typeId, entity);
                    await wait(50); // Small delay between insertions to stabilize NeDB
                }
            } else {
                console.log(`[Seed] Records already exist for ${label}.`);
            }
        };

        await seedEntities(brands._id, [
            { Name: 'Apple', Website: 'apple.com', 'Is Featured': true },
            { Name: 'Google', Website: 'google.com', 'Is Featured': true },
            { Name: 'Microsoft', Website: 'microsoft.com', 'Is Featured': false }
        ], 'Brands');

        await seedEntities(categories._id, [
            { Title: 'Smartphones', Description: 'Mobile devices' },
            { Title: 'Laptops', Description: 'Portable computers' }
        ], 'Categories');

        await seedEntities(logs._id, [
            { Timestamp: new Date().toISOString().split('T')[0], Event: 'System initialized', Resolved: true },
            { Timestamp: new Date().toISOString().split('T')[0], Event: 'Database seeding completed', Resolved: true },
            { Timestamp: new Date().toISOString().split('T')[0], Event: 'Security audit required', Resolved: false }
        ], 'Logs');

        console.log('[Seed] Data seeding process finished.');
    } catch (err) {
        console.error('[Seed] Error during seeding:', err);
    }
};

module.exports = seedData;
