/**
 * Emergency Admin Reset Script
 * 
 * Usage: node scripts/reset_admin.js <username> <new_password> [--admin]
 * 
 * This script interacts directly with the NeDB database to reset a user's password.
 * It can also promote a user to 'admin' role if the --admin flag is provided.
 */

const path = require('path');
const bcrypt = require('bcryptjs');
const Datastore = require('nedb-promises');

// Configuration
const DB_PATH = path.join(__dirname, '../data/users.db');

async function run() {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.log('Usage: node reset_admin.js <username> <new_password> [--admin]');
        process.exit(1);
    }

    const username = args[0];
    const newPassword = args[1];
    const promoteToAdmin = args.includes('--admin');

    console.log(`Attempting to reset password for user: ${username}...`);

    try {
        const usersDb = Datastore.create(DB_PATH);
        const user = await usersDb.findOne({ username });

        if (!user) {
            console.error(`Error: User '${username}' not found in database ${DB_PATH}`);
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateData = { 
            password: hashedPassword,
            updatedAt: new Date().toISOString()
        };

        if (promoteToAdmin) {
            updateData.role = 'admin';
            updateData.status = 'active';
            console.log('User will also be promoted to admin role.');
        }

        await usersDb.update(
            { _id: user._id },
            { $set: updateData }
        );

        console.log('--------------------------------------------------');
        console.log(`SUCCESS: Password for '${username}' has been reset.`);
        if (promoteToAdmin) {
            console.log(`SUCCESS: Role for '${username}' set to 'admin'.`);
        }
        console.log('--------------------------------------------------');
        
    } catch (err) {
        console.error('An error occurred during the reset process:');
        console.error(err);
        process.exit(1);
    }
}

run();
