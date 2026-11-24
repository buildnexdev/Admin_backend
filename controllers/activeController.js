const { Op } = require('sequelize');
const Banner = require('../models/banner');
const Project = require('../models/project');
const Service = require('../models/service');
const Blog = require('../models/blog');
const SrsImage = require('../models/srsImage');

/**
 * GET APIs - active items only (isActive: 1)
 */

exports.getActiveBanners = async (req, res) => {
    try {
        const { companyID } = req.params;
        const { category } = req.query;
        const where = { companyID, isActive: 1 };
        if (category && category !== 'all') {
            if (category === 'Builders' || category === 'HomeBanner') {
                where.category = { [Op.or]: ['Builders', 'HomeBanner'] };
            } else {
                where.category = category;
            }
        }
        const allBanners = await Banner.findAll({ where });

        // Filter out dummy placeholder seed data (e.g. 'images/hero-construction.jpg') if real uploaded banners exist
        const realBanners = allBanners.filter(b => b.imageUrl && !b.imageUrl.startsWith('images/'));
        const data = realBanners.length > 0 ? realBanners : allBanners;

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getActiveProjects = async (req, res) => {
    try {
        const { companyID } = req.params;
        const { category } = req.query;
        const where = { companyID, isActive: 1 };
        if (category) where.category = category;
        const data = await Project.findAll({ where });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getActiveServices = async (req, res) => {
    try {
        const { companyID } = req.params;
        const { category } = req.query;
        const where = { companyID, isActive: 1 };
        if (category) where.category = category;
        const data = await Service.findAll({ where });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getActiveBlogs = async (req, res) => {
    try {
        const { companyID } = req.params;
        const { category } = req.query;
        const where = { companyID, isActive: 1 };
        if (category) where.category = category;
        const data = await Blog.findAll({ where });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
