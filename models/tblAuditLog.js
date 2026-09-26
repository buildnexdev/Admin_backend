const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const TblAuditLog = db.define('tblAuditLog', {
    AuditLogId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'AuditLogId',
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'UserId',
    },
    CompanyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'CompanyId',
    },
    Action: {
        type: DataTypes.STRING(64),
        allowNull: false,
        field: 'Action',
    },
    Module: {
        type: DataTypes.STRING(64),
        allowNull: true,
        field: 'Module',
    },
    RecordId: {
        type: DataTypes.STRING(64),
        allowNull: true,
        field: 'RecordId',
    },
    Description: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'Description',
    },
    IpAddress: {
        type: DataTypes.STRING(64),
        allowNull: true,
        field: 'IpAddress',
    },
    CreatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'CreatedDate',
    },
}, {
    tableName: 'tblAuditLog',
    timestamps: false,
    underscored: false,
    freezeTableName: true,
});

module.exports = TblAuditLog;
