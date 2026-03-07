const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const Menu = db.define('Menu', {
    companyID: {
        type: DataTypes.BIGINT(11),
        allowNull: false,
        primaryKey: true
    },
    projects: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
        defaultValue: 0
    },
    company: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
        defaultValue: 0
    },
    banners: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
        defaultValue: 0
    },
    blog: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
        defaultValue: 0
    },
    service: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
        defaultValue: 0
    },
    contact: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
        defaultValue: 0
    },
    quotation: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
        defaultValue: 0
    },
    projectGallery: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
        defaultValue: 0
    },
    revenueReport: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
        defaultValue: 0
    },
    categories: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'menu',
    timestamps: false
});

module.exports = Menu;
