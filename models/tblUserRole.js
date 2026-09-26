const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const TblUserRole = db.define('tblUserRole', {
    UserRoleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'UserRoleId',
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'UserId',
    },
    RoleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'RoleId',
    },
    CompanyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'CompanyId',
    },
}, {
    tableName: 'tblUserRole',
    timestamps: false,
    underscored: false,
    freezeTableName: true,
});

module.exports = TblUserRole;
