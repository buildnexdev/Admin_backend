const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const HomePageImage = db.define('home_page_images', {
    imageId: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    companyID: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    userId: {
        type: DataTypes.BIGINT(20),
        allowNull: false
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
    tableName: 'home_page_images',
    timestamps: false
});

module.exports = HomePageImage;

