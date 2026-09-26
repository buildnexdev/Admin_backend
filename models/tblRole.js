const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const TblRole = db.define('tblRole', {
    RoleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'RoleId',
    },
    Code: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
        field: 'Code',
    },
    Name: {
        type: DataTypes.STRING(128),
        allowNull: false,
        field: 'Name',
    },
    Description: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'Description',
    },
    IsSystem: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
        field: 'IsSystem',
    },
    CreatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'CreatedDate',
    },
    UpdatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'UpdatedDate',
    },
}, {
    tableName: 'tblRole',
    timestamps: false,
    underscored: false,
    freezeTableName: true,
});

module.exports = TblRole;
