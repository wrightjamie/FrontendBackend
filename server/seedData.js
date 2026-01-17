const DataType = require('./models/DataType');
const DataEntity = require('./models/DataEntity');

const seedData = async () => {
    try {
        const types = await DataType.findAll();
        if (types.length > 0) {
            console.log('[Seed] Database not empty, skipping data seeding.');
            return;
        }

        console.log('[Seed] Seeding initial data types and entities...');

        // 1. Create Brands (Ordered)
        const brands = await DataType.create({
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

        // 2. Create Categories (Unordered)
        const categories = await DataType.create({
            name: 'Categories',
            slug: 'categories',
            description: 'Product categories',
            isOrdered: false,
            fields: [
                { name: 'Title', type: 'text', description: 'Category title', required: true },
                { name: 'Description', type: 'text', description: 'Category description', required: false }
            ]
        });

        // 3. Seed some Brands
        await DataEntity.create(brands._id, { Name: 'Apple', Website: 'apple.com', 'Is Featured': true });
        await DataEntity.create(brands._id, { Name: 'Google', Website: 'google.com', 'Is Featured': true });
        await DataEntity.create(brands._id, { Name: 'Microsoft', Website: 'microsoft.com', 'Is Featured': false });

        // 4. Seed some Categories
        await DataEntity.create(categories._id, { Title: 'Smartphones', Description: 'Mobile devices' });
        await DataEntity.create(categories._id, { Title: 'Laptops', Description: 'Portable computers' });

        console.log('[Seed] Data seeding completed successfully.');
    } catch (err) {
        console.error('[Seed] Error during seeding:', err);
    }
};

module.exports = seedData;
