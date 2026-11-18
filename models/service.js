const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const Service = db.define('Service', {
    id: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    iconName: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    userId: {
        type: DataTypes.BIGINT(20),
        allowNull: true
    },
    companyID: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    isActive: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1
    }
}, {
    tableName: 'tblService',
    timestamps: true
});

module.exports = Service;
