const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const Banner = db.define('Banner', {
    id: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    subtitle: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    companyID: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    page: {
        type: DataTypes.STRING(50),
        defaultValue: 'home'
    },
    isActive: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1
    }
}, {
    tableName: 'banners',
    timestamps: true
});

module.exports = Banner;
