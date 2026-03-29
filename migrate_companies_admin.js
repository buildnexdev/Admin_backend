const { Sequelize, DataTypes } = require('sequelize');
const db = require('./config/db.config');

async function migrate() {
    try {
        const queryInterface = db.getQueryInterface();
        const tableInfo = await queryInterface.describeTable('company');

        if (!tableInfo.adminName) {
            await queryInterface.addColumn('company', 'adminName', {
                type: DataTypes.STRING(255),
                allowNull: true
            });
            console.log('Added adminName'); ``
        }
        if (!tableInfo.adminPhone) {
            await queryInterface.addColumn('company', 'adminPhone', {
                type: DataTypes.BIGINT(20),
                allowNull: true
            });
            console.log('Added adminPhone');
        }
        if (!tableInfo.adminLocation) {
            await queryInterface.addColumn('company', 'adminLocation', {
                type: DataTypes.TEXT,
                allowNull: true
            });
            console.log('Added adminLocation');
        }
        if (!tableInfo.adminCategory) {
            await queryInterface.addColumn('company', 'adminCategory', {
                type: DataTypes.STRING(255),
                allowNull: true
            });
            console.log('Added adminCategory');
        }
        console.log('Migration complete');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
