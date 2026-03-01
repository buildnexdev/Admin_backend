const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const Blog = db.define('Blog', {
    id: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    link: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    userId: {
        type: DataTypes.BIGINT(20),
        allowNull: true
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    companyID: {
        type: DataTypes.BIGINT(20),
        allowNull: false
    },
    isActive: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1
    }
}, {
    tableName: 'blogs',
    timestamps: true
});

module.exports = Blog;
