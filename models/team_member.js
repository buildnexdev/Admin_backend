const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const TeamMember = db.define('TeamMember', {
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
    designation: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    tags: {
        type: DataTypes.TEXT, // Comma-separated tags
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING(255),
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
    tableName: 'team_members',
    timestamps: true
});

module.exports = TeamMember;
