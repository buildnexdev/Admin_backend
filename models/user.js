const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const User = db.define('tblUser', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(190),
        allowNull: true,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'LOCKED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
    },
    avatar_key: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    phone_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    last_login_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    failed_logins: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
    },
    locked_until: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    token_version: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    // Virtual getters for compatibility
    userId: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.getDataValue('id');
        },
    },
    phoneNumber: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.getDataValue('phone');
        },
    },
    password: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.getDataValue('password_hash');
        },
    },
    isActive: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.getDataValue('status') === 'ACTIVE' ? 1 : 0;
        },
    },
}, {
    tableName: 'tblUser',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
    freezeTableName: true,
});

module.exports = User;
