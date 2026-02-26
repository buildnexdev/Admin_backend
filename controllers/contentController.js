const Project = require('../models/project');
const Banner = require('../models/banner');
const Service = require('../models/service');
const Blog = require('../models/blog');
const ContactMessage = require('../models/contact');

// Helper for image URL
const getImageUrl = (req, filename) => {
    return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

const contentController = {
    // PROJECTS
    addProject: async (req, res) => {
        try {
            const { title, description, category, companyID } = req.body;
            const imageUrl = req.file ? getImageUrl(req, req.file.filename) : null;
            const project = await Project.create({ title, description, category, companyID, imageUrl });
            res.status(201).json({ success: true, data: project });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getProjects: async (req, res) => {
        try {
            const projects = await Project.findAll({ where: { companyID: req.params.companyID, isActive: 1 } });
            res.json({ success: true, data: projects });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    updateProject: async (req, res) => {
        try {
            const { title, description, category } = req.body;
            const updateData = { title, description, category };
            if (req.file) {
                updateData.imageUrl = getImageUrl(req, req.file.filename);
            }
            await Project.update(updateData, { where: { id: req.params.id } });
            res.json({ success: true, message: 'Project updated successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteProject: async (req, res) => {
        try {
            await Project.update({ isActive: 0 }, { where: { id: req.params.id } });
            res.json({ success: true, message: 'Project deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // BANNERS
    addBanner: async (req, res) => {
        try {
            const { title, subtitle, companyID, page } = req.body;
            const imageUrl = req.file ? getImageUrl(req, req.file.filename) : null;
            if (!imageUrl) return res.status(400).json({ success: false, message: 'Image is required' });

            const banner = await Banner.create({ title, subtitle, companyID, page, imageUrl });
            res.status(201).json({ success: true, data: banner });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getBanners: async (req, res) => {
        try {
            const { companyID } = req.params;
            const { category } = req.query;
            const whereClause = { companyID, isActive: 1 };
            if (category) {
                whereClause.category = category;
            }
            const banners = await Banner.findAll({ where: whereClause });
            res.json({ success: true, data: banners });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    updateBanner: async (req, res) => {
        try {
            const { title, subtitle, page } = req.body;
            const updateData = { title, subtitle, page };
            if (req.file) {
                updateData.imageUrl = getImageUrl(req, req.file.filename);
            }
            await Banner.update(updateData, { where: { id: req.params.id } });
            res.json({ success: true, message: 'Banner updated successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteBanner: async (req, res) => {
        try {
            await Banner.update({ isActive: 0 }, { where: { id: req.params.id } });
            res.json({ success: true, message: 'Banner deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    saveBannerPaths: async (req, res) => {
        try {
            const { bannerPaths, companyID, userId, category } = req.body;
            if (!bannerPaths || !Array.isArray(bannerPaths)) {
                return res.status(400).json({ success: false, message: 'bannerPaths must be an array' });
            }

            const banners = bannerPaths.map(path => ({
                imageUrl: (path.startsWith('http') || path.startsWith('https')) ? path : getImageUrl(req, path),
                companyID,
                userId,
                category: category || 'HomeBanner',
                page: 'home'
            }));

            await Banner.bulkCreate(banners);
            res.status(201).json({ success: true, message: 'Banners saved successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // SERVICES
    addService: async (req, res) => {
        try {
            const { title, description, iconName, companyID } = req.body;
            const service = await Service.create({ title, description, iconName, companyID });
            res.status(201).json({ success: true, data: service });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getServices: async (req, res) => {
        try {
            const services = await Service.findAll({ where: { companyID: req.params.companyID, isActive: 1 } });
            res.json({ success: true, data: services });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    updateService: async (req, res) => {
        try {
            const { title, description, iconName } = req.body;
            await Service.update({ title, description, iconName }, { where: { id: req.params.id } });
            res.json({ success: true, message: 'Service updated successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteService: async (req, res) => {
        try {
            await Service.update({ isActive: 0 }, { where: { id: req.params.id } });
            res.json({ success: true, message: 'Service deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // BLOGS
    addBlog: async (req, res) => {
        try {
            const { title, content, author, companyID } = req.body;
            const imageUrl = req.file ? getImageUrl(req, req.file.filename) : null;
            const blog = await Blog.create({ title, content, author, companyID, imageUrl });
            res.status(201).json({ success: true, data: blog });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getBlogs: async (req, res) => {
        try {
            const blogs = await Blog.findAll({ where: { companyID: req.params.companyID, isActive: 1 } });
            res.json({ success: true, data: blogs });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    updateBlog: async (req, res) => {
        try {
            const { title, content, author } = req.body;
            const updateData = { title, content, author };
            if (req.file) {
                updateData.imageUrl = getImageUrl(req, req.file.filename);
            }
            await Blog.update(updateData, { where: { id: req.params.id } });
            res.json({ success: true, message: 'Blog updated successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteBlog: async (req, res) => {
        try {
            await Blog.update({ isActive: 0 }, { where: { id: req.params.id } });
            res.json({ success: true, message: 'Blog deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // CONTACT MESSAGES
    addContactMessage: async (req, res) => {
        try {
            const { name, email, subject, message, companyID } = req.body;
            const contact = await ContactMessage.create({ name, email, subject, message, companyID });
            res.status(201).json({ success: true, data: contact });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getContactMessages: async (req, res) => {
        try {
            const messages = await ContactMessage.findAll({ where: { companyID: req.params.companyID } });
            res.json({ success: true, data: messages });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = contentController;
