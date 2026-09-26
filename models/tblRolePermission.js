const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const TblRolePermission = db.define('tblRolePermission', {
    RolePermissionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'RolePermissionId',
    },
    RoleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'RoleId',
    },
    PermissionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'PermissionId',
    },
}, {
    tableName: 'tblRolePermission',
    timestamps: false,
    underscored: false,
    freezeTableName: true,
});

module.exports = TblRolePermission;
