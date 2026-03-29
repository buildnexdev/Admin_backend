const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const Company = db.define('Company', {
    companyID: {
        type: DataTypes.BIGINT(20),
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    logo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    contactno1: {
        type: DataTypes.BIGINT(20),
        allowNull: true
    },
    contactno2: {
        type: DataTypes.BIGINT(20),
        allowNull: true
    },
    contactno3: {
        type: DataTypes.BIGINT(20),
        allowNull: true
    },
    discription: { // Using user's spelling from screenshot
        type: DataTypes.TEXT,
        allowNull: false
    },
    location: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    productType: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    website: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    sellingPrice: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    staff: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    adminName: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    adminPhone: {
        type: DataTypes.BIGINT(20),
        allowNull: true
    },
    adminLocation: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    adminCategory: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    isActive: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
        defaultValue: 1
    },
    joiningDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    createdOn: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'createdOn'
    },
    updatedOn: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updatedOn'
    }
}, {
    tableName: 'company',
    timestamps: false // Manual timestamps in the table
});

module.exports = Company;
