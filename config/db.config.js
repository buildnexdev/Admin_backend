const { Sequelize } = require('sequelize');

const db = new Sequelize(
    process.env.DB_NAME || 'admin_panel',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || 'Buildnexdev2025',
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