const db = require('./config/db.config');
const Company = require('./models/company');

async function migrate() {
    try {
        await db.authenticate();
        console.log('DB Authenticated');
        await Company.sync({ alter: true });
        console.log('Company table updated successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
