const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const Review = db.define('Review', {
    id: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    reviewerName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reviewText: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    socialLink: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    companyID: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    userId: {
        type: DataTypes.BIGINT(20),
        allowNull: true
    },
    isActive: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1
    }
}, {
    tableName: 'reviews',
    timestamps: true
});

module.exports = Review;
