const db = require('../config/db.config');
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
            const body = req.body || {};
            const { title, description, category, companyID } = body;
            const imageUrl = req.file
                ? req.file.filename
                : (body.imagePath || body.imageUrl || null);
            const project = await Project.create({ title, description, category, companyID, imageUrl });
            res.status(201).json({ success: true, data: project });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getProjects: async (req, res) => {
        try {
            const projects = await Project.findAll({ where: { companyID: req.params.companyID } });
            res.json({ success: true, data: projects });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    updateProject: async (req, res) => {
        try {
            const body = req.body || {};
            const updateData = {};
            if (body.title !== undefined) updateData.title = body.title;
            if (body.description !== undefined) updateData.description = body.description;
            if (body.category !== undefined) updateData.category = body.category;
            const isActiveRaw = body.isActive !== undefined ? body.isActive : body.is_active;
            if (isActiveRaw !== undefined && isActiveRaw !== null && isActiveRaw !== '') {
                const v = isActiveRaw;
                updateData.isActive = (v === 0 || v === '0' || v === false || String(v).toLowerCase() === 'false') ? 0 : 1;
            }
            if (req.file) {
                updateData.imageUrl = req.file.filename;
            } else if (body.imagePath !== undefined || body.imageUrl !== undefined) {
                updateData.imageUrl = body.imagePath || body.imageUrl;
            }
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ success: false, message: 'No fields to update' });
            }
            await Project.update(updateData, { where: { id: req.params.id } });
            const project = await Project.findByPk(req.params.id);
            res.json({ success: true, message: 'Project updated successfully', data: project });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteProject: async (req, res) => {
        try {
            const deleted = await Project.destroy({ where: { id: req.params.id } });
            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Project not found' });
            }
            res.json({ success: true, message: 'Project deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // BANNERS
    addBanner: async (req, res) => {
        try {
            const { title, subtitle, companyID, page, imagePath, userId, category } = req.body;
            const imageUrl = req.file
                ? req.file.filename
                : (imagePath || req.body.imageUrl || null);
            if (!imageUrl) return res.status(400).json({ success: false, message: 'Image is required (send file or imagePath)' });

            const payload = { title, subtitle, companyID, page, imageUrl };
            if (userId !== undefined) payload.userId = userId;
            if (category !== undefined) payload.category = category;
            const banner = await Banner.create(payload);
            res.status(201).json({ success: true, data: banner });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getBanners: async (req, res) => {
        try {
            const { companyID } = req.params;
            const { category } = req.query;
            const whereClause = { companyID };
            if (category) {
                whereClause.category = category;
            }
            // unscoped() ensures no default scope (e.g. isActive) filters out inactive banners
            const banners = await Banner.unscoped().findAll({ where: whereClause });

            res.json({ success: true, data: banners });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    updateBanner: async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: 'Invalid banner id' });
            }
            const body = req.body || {};
            const { title, subtitle, page, userId, category } = body;
            const isActiveRaw = body.isActive !== undefined ? body.isActive : body.is_active;
            const updateData = {};
            if (title !== undefined) updateData.title = title;
            if (subtitle !== undefined) updateData.subtitle = subtitle;
            if (page !== undefined) updateData.page = page;
            if (userId !== undefined) updateData.userId = userId;
            if (category !== undefined) updateData.category = category;
            // Explicit 0/1: accept 0, '0', false as inactive (from JSON or form-data)
            if (isActiveRaw !== undefined && isActiveRaw !== null && isActiveRaw !== '') {
                const v = isActiveRaw;
                updateData.isActive = (v === 0 || v === '0' || v === false || String(v).toLowerCase() === 'false') ? 0 : 1;
            }
            if (req.file) {
                updateData.imageUrl = req.file.filename;
            } else if (body.imagePath !== undefined || body.imageUrl !== undefined || body.image !== undefined) {
                updateData.imageUrl = body.imagePath || body.imageUrl || body.image;
            }
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ success: false, message: 'No fields to update' });
            }
            const isActiveValue = updateData.isActive;
            if (isActiveValue !== undefined) {
                delete updateData.isActive;
            }
            // Check banner exists first
            const existing = await Banner.unscoped().findByPk(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: 'Banner not found', id });
            }
            // Persist isActive with raw SQL so it always writes to DB (avoids Sequelize column/cache issues)
            if (isActiveValue !== undefined) {
                await db.query(
                    'UPDATE `tblBannerImages` SET isActive = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
                    { replacements: [isActiveValue, id] }
                );
            }
            if (Object.keys(updateData).length > 0) {
                await Banner.update(updateData, {
                    where: { id },
                    fields: Object.keys(updateData)
                });
            }
            const banner = await Banner.unscoped().findByPk(id);
            res.json({ success: true, message: 'Banner updated successfully', data: banner });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteBanner: async (req, res) => {
        try {
            const id = req.params.id;
            const deleted = await Banner.destroy({ where: { id } });
            if (!deleted) {
                // If destroy fails (maybe due to unscoped issues), try raw SQL
                await db.query('DELETE FROM `tblBannerImages` WHERE id = ?', { replacements: [id] });
            }
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
                imageUrl: path,
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
            const body = req.body || {};
            const title = body.title;
            const name = body.name;
            const description = body.description;
            const iconName = body.iconName;
            const category = body.category;
            const userId = body.userId;
            const companyID = body.companyID;
            const imageUrl = req.file ? req.file.filename : (body.imageUrl || body.imagePath || null);
            const payload = {
                title: title ?? name,
                name: name ?? title,
                description,
                iconName,
                category,
                userId: userId !== undefined && userId !== '' ? parseInt(userId, 10) : null,
                companyID: companyID !== undefined && companyID !== '' ? parseInt(companyID, 10) : null,
                imageUrl
            };
            if (payload.companyID == null) {
                return res.status(400).json({ success: false, message: 'companyID is required' });
            }
            const service = await Service.create(payload);
            res.status(201).json({ success: true, data: service });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getServices: async (req, res) => {
        try {
            const services = await Service.findAll({ where: { companyID: req.params.companyID } });
            res.json({ success: true, data: services });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    updateService: async (req, res) => {
        try {
            const body = req.body || {};
            const updateData = {};
            if (body.title !== undefined) updateData.title = body.title;
            if (body.name !== undefined) updateData.name = body.name;
            if (body.description !== undefined) updateData.description = body.description;
            if (body.iconName !== undefined) updateData.iconName = body.iconName;
            if (body.category !== undefined) updateData.category = body.category;
            if (body.userId !== undefined) updateData.userId = body.userId === '' ? null : parseInt(body.userId, 10);
            if (req.file) updateData.imageUrl = req.file.filename;
            else if (body.imagePath !== undefined || body.imageUrl !== undefined || body.image !== undefined) {
                updateData.imageUrl = body.imagePath || body.imageUrl || body.image;
            }
            const isActiveRaw = body.isActive !== undefined ? body.isActive : body.is_active;
            if (isActiveRaw !== undefined && isActiveRaw !== null && isActiveRaw !== '') {
                const v = isActiveRaw;
                updateData.isActive = (v === 0 || v === '0' || v === false || String(v).toLowerCase() === 'false') ? 0 : 1;
            }
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ success: false, message: 'No fields to update' });
            }
            await Service.update(updateData, { where: { id: req.params.id } });
            const service = await Service.findByPk(req.params.id);
            res.json({ success: true, message: 'Service updated successfully', data: service });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteService: async (req, res) => {
        try {
            const deleted = await Service.destroy({ where: { id: req.params.id } });
            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Service not found' });
            }
            res.json({ success: true, message: 'Service deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // BLOGS
    addBlog: async (req, res) => {
        try {
            const body = req.body || {};
            const { title, content, author, companyID, link, userId, category } = body;
            const imageUrl = req.file
                ? req.file.filename
                : (body.imagePath || body.imageUrl || null);
            const payload = {
                title,
                content,
                author: author || null,
                companyID,
                imageUrl: imageUrl || null,
                link: link || null,
                userId: userId !== undefined && userId !== '' ? parseInt(userId, 10) : null,
                category: category || null
            };
            if (!payload.companyID) {
                return res.status(400).json({ success: false, message: 'companyID is required' });
            }
            const blog = await Blog.create(payload);
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
            const body = req.body || {};
            const updateData = {};
            if (body.title !== undefined) updateData.title = body.title;
            if (body.content !== undefined) updateData.content = body.content;
            if (body.author !== undefined) updateData.author = body.author;
            if (body.link !== undefined) updateData.link = body.link;
            if (body.userId !== undefined) updateData.userId = body.userId === '' ? null : parseInt(body.userId, 10);
            if (body.category !== undefined) updateData.category = body.category;
            const isActiveRaw = body.isActive !== undefined ? body.isActive : body.is_active;
            if (isActiveRaw !== undefined && isActiveRaw !== null && isActiveRaw !== '') {
                const v = isActiveRaw;
                updateData.isActive = (v === 0 || v === '0' || v === false || String(v).toLowerCase() === 'false') ? 0 : 1;
            }
            if (req.file) {
                updateData.imageUrl = req.file.filename;
            } else if (body.imagePath !== undefined || body.imageUrl !== undefined) {
                updateData.imageUrl = body.imagePath || body.imageUrl;
            }
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ success: false, message: 'No fields to update' });
            }
            await Blog.update(updateData, { where: { id: req.params.id } });
            const blog = await Blog.findByPk(req.params.id);
            res.json({ success: true, message: 'Blog updated successfully', data: blog });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteBlog: async (req, res) => {
        try {
            const deleted = await Blog.destroy({ where: { id: req.params.id } });
            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Blog not found' });
            }
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
