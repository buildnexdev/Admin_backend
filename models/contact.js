const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const ContactMessage = db.define('ContactMessage', {
    id: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    companyID: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    isRead: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0
    }
}, {
    tableName: 'contact_messages',
    timestamps: true
});

module.exports = ContactMessage;
