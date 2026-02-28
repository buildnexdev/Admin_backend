const { Sequelize } = require('sequelize');

const db = new Sequelize('admin_panel', 'root', 'root', {
    host: '127.0.0.1',
    port: 8889,
    dialect: 'mysql',
});

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