const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const BuilderProject = db.define('builder_projects', {
    projectId: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    companyID: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    userId: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    fileUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    isActive: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
        defaultValue: 1
    },
    createdOn: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedOn: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'builder_projects',
    timestamps: false
});

module.exports = BuilderProject;
