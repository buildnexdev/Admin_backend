const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const TblPermission = db.define('tblPermission', {
    PermissionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'PermissionId',
    },
    Code: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
        field: 'Code',
    },
    Module: {
        type: DataTypes.STRING(64),
        allowNull: false,
        field: 'Module',
    },
    Action: {
        type: DataTypes.STRING(64),
        allowNull: false,
        field: 'Action',
    },
    Description: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'Description',
    },
    CreatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'CreatedDate',
    },
}, {
    tableName: 'tblPermission',
    timestamps: false,
    underscored: false,
    freezeTableName: true,
});

module.exports = TblPermission;
