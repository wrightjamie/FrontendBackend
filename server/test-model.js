const User = require('./models/User');
// Trigger DB init
require('./config/db');

async function test() {
    console.log('Testing User.findOne...');
    try {
        const admin = await User.findOne({ role: 'admin' });
        console.log('✅ Query success. Admin:', admin);
    } catch (err) {
        console.error('❌ Query failed:', err);
    }
}

test();
