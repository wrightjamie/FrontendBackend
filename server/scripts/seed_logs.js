const db = require('./config/db');

async function seedLogs() {
    console.log('Cleaning up previously seeded logs...');
    const typeId = 'SliAiEZrvRngC2XE';

    // Remove all logs for this type (except maybe the original ones, but let's just clear for now to be safe)
    await db.dataEntities.remove({ typeId }, { multi: true });
    console.log('Database cleared for System Logs.');

    const logs = [];
    const now = new Date();

    for (let i = 1; i <= 120; i++) {
        // Match existing format YYYY-MM-DD
        const date = new Date(now.getTime() - (120 - i) * 86400000); // spread across 120 days
        const dateStr = date.toISOString().split('T')[0];

        logs.push({
            Timestamp: dateStr,
            Event: `System Event #${i}: Automated health check performed.`,
            Resolved: Math.random() > 0.5,
            typeId,
            order: i
        });
    }

    try {
        await db.dataEntities.insert(logs);
        console.log('Successfully re-seeded 120 logs with correct format.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seedLogs();
