const { Sequelize } = require('sequelize');

if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_HOST) {
    console.warn('[DB] Warning: DB_NAME, DB_USER, and/or DB_HOST are not fully set in environment');
}

const db = new Sequelize(
    process.env.DB_NAME || 'admin_panel',
    process.env.DB_USER || 'root',
    process.env.DB_PASS ?? '',
    {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        dialect: process.env.DB_DIALECT || 'mysql',
    }
);

const connectDB = async () => {
    try {

        await db.authenticate();
        console.log('Database connected successfully');

    } catch (error) {
        console.error('Unable to connect to the database: ', error.message);

    }
};

connectDB();

module.exports = db;
