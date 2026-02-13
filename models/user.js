const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const User = db.define('user', {
    userId: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.BIGINT(10),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    companyID: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    location: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isActive: {
        type: DataTypes.TINYINT(4),
        allowNull: false
    },
    createdOn: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedOn: {
        type: DataTypes.DATE,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(50),
        defaultValue: 'user'
    },
    category: {
        type: DataTypes.ENUM('Builders', 'Photography', 'School'),
        allowNull: true
    }
}, {
    tableName: 'user',
    timestamps: false
});

module.exports = User;
