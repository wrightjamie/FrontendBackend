const db = require('../config/db');

async function seedCategories() {
    console.log('Cleaning up existing categories...');
    const typeId = 'vXAxCGqH8CmSq9Oy';

    await db.dataEntities.remove({ typeId }, { multi: true });
    console.log('Database cleared for Categories.');

    const categories = [];
    const colors = ['red', 'blue', 'green'];

    for (let i = 1; i <= 25; i++) {
        categories.push({
            Title: `Category ${i}`,
            Description: `This is the description for Category ${i}.`,
            Colour: colors[Math.floor(Math.random() * colors.length)],
            typeId,
            order: i
        });
    }

    try {
        await db.dataEntities.insert(categories);
        console.log('Successfully seeded 25 categories.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seedCategories();
