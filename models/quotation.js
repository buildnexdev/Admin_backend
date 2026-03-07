const { DataTypes } = require('sequelize');
const db = require('../config/db.config');
const { v4: uuidv4 } = require('uuid')

const Quotation = db.define('Quotation', {
    id: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    client_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    companyID: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    userId: {
        type: DataTypes.BIGINT(20),
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true
    },
    project_details: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    link_click_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    token: {
        type: DataTypes.STRING(36),
        allowNull: true,
        unique: true,
        defaultValue: () => uuidv4()
    }

}, {
    tableName: 'quotations',
    timestamps: true
});

module.exports = Quotation;
