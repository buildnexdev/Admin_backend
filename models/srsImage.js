const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const SrsImage = db.define('SrsImage', {
    id: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    disc: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    location: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const raw = this.getDataValue('imageUrl');
            if (raw == null || raw === '') return [];
            try {
                const arr = JSON.parse(raw);
                return Array.isArray(arr) ? arr : [raw];
            } catch (_) {
                return raw ? [raw] : [];
            }
        },
        set(val) {
            const arr = Array.isArray(val) ? val : (val != null ? [val] : []);
            this.setDataValue('imageUrl', arr.length ? JSON.stringify(arr) : null);
        }
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
        allowNull: false,
        defaultValue: 1
    }
}, {
    tableName: 'srs_images',
    timestamps: true
});

module.exports = SrsImage;
