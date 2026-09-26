const db = require('../config/db.config');
const Project = require('../models/project');
const Banner = require('../models/banner');
const Service = require('../models/service');
const Blog = require('../models/blog');
const ContactMessage = require('../models/contact');
const Review = require('../models/review');
const TeamMember = require('../models/team_member');
const { isSuperAdmin, tenantWhere, resolveCreateCompanyID } = require('../utils/tenant');


// Helper for image URL
const getImageUrl = (req, filename) => {
    return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

const contentController = {
    // PROJECTS
    addProject: async (req, res) => {
        try {
            const body = req.body || {};
            const { title, description, category } = body;
            const companyID = resolveCreateCompanyID(req, body.companyID);
            if (companyID == null) {
                return res.status(400).json({ success: false, message: 'companyID is required' });
            }
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
            let companyID = req.params.companyID;
            if ((companyID == null || companyID === '') && req.auth && !isSuperAdmin(req)) {
                companyID = req.auth.companyID;
            }
            const projects = await Project.findAll({ where: { companyID } });
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
            const where = tenantWhere(req, { id: req.params.id });
            const [updated] = await Project.update(updateData, { where });
            if (!updated) {
                return res.status(404).json({ success: false, message: 'Project not found' });
            }
            const project = await Project.findOne({ where });
            res.json({ success: true, message: 'Project updated successfully', data: project });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteProject: async (req, res) => {
        try {
            const where = tenantWhere(req, { id: req.params.id });
            const deleted = await Project.destroy({ where });
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
            const { title, subtitle, page, imagePath, userId, category } = req.body;
            const companyID = resolveCreateCompanyID(req, req.body.companyID);
            if (companyID == null) {
                return res.status(400).json({ success: false, message: 'companyID is required' });
            }
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
            let { companyID } = req.params;
            if ((companyID == null || companyID === '') && req.auth && !isSuperAdmin(req)) {
                companyID = req.auth.companyID;
            }
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
            const where = tenantWhere(req, { id });
            // Check banner exists first (tenant-scoped)
            const existing = await Banner.unscoped().findOne({ where });
            if (!existing) {
                return res.status(404).json({ success: false, message: 'Banner not found', id });
            }
            // Persist isActive with raw SQL so it always writes to DB (avoids Sequelize column/cache issues)
            if (isActiveValue !== undefined) {
                if (isSuperAdmin(req)) {
                    await db.query(
                        'UPDATE `tblBannerImages` SET isActive = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
                        { replacements: [isActiveValue, id] }
                    );
                } else {
                    await db.query(
                        'UPDATE `tblBannerImages` SET isActive = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND companyID = ?',
                        { replacements: [isActiveValue, id, req.auth.companyID] }
                    );
                }
            }
            if (Object.keys(updateData).length > 0) {
                await Banner.update(updateData, {
                    where,
                    fields: Object.keys(updateData)
                });
            }
            const banner = await Banner.unscoped().findOne({ where });
            res.json({ success: true, message: 'Banner updated successfully', data: banner });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteBanner: async (req, res) => {
        try {
            const id = req.params.id;
            const where = tenantWhere(req, { id });
            const deleted = await Banner.destroy({ where });
            if (!deleted) {
                if (isSuperAdmin(req)) {
                    await db.query('DELETE FROM `tblBannerImages` WHERE id = ?', { replacements: [id] });
                } else {
                    await db.query('DELETE FROM `tblBannerImages` WHERE id = ? AND companyID = ?', {
                        replacements: [id, req.auth.companyID]
                    });
                }
            }
            res.json({ success: true, message: 'Banner deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    saveBannerPaths: async (req, res) => {
        try {
            const { bannerPaths, userId, category } = req.body;
            const companyID = resolveCreateCompanyID(req, req.body.companyID);
            if (!bannerPaths || !Array.isArray(bannerPaths)) {
                return res.status(400).json({ success: false, message: 'bannerPaths must be an array' });
            }
            if (companyID == null) {
                return res.status(400).json({ success: false, message: 'companyID is required' });
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
            const companyID = resolveCreateCompanyID(req, body.companyID);
            const imageUrl = req.file ? req.file.filename : (body.imageUrl || body.imagePath || null);
            const payload = {
                title: title ?? name,
                name: name ?? title,
                description,
                iconName,
                category,
                userId: userId !== undefined && userId !== '' ? parseInt(userId, 10) : null,
                companyID: companyID !== undefined && companyID !== '' && companyID != null ? parseInt(companyID, 10) : null,
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
            let companyID = req.params.companyID;
            if ((companyID == null || companyID === '') && req.auth && !isSuperAdmin(req)) {
                companyID = req.auth.companyID;
            }
            const services = await Service.findAll({ where: { companyID } });
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
            const where = tenantWhere(req, { id: req.params.id });
            const [updated] = await Service.update(updateData, { where });
            if (!updated) {
                return res.status(404).json({ success: false, message: 'Service not found' });
            }
            const service = await Service.findOne({ where });
            res.json({ success: true, message: 'Service updated successfully', data: service });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteService: async (req, res) => {
        try {
            const where = tenantWhere(req, { id: req.params.id });
            const deleted = await Service.destroy({ where });
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
            const { title, content, author, link, userId, category } = body;
            const companyID = resolveCreateCompanyID(req, body.companyID);
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
            let companyID = req.params.companyID;
            if ((companyID == null || companyID === '') && req.auth && !isSuperAdmin(req)) {
                companyID = req.auth.companyID;
            }
            const blogs = await Blog.findAll({ where: { companyID, isActive: 1 } });
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
            const where = tenantWhere(req, { id: req.params.id });
            const [updated] = await Blog.update(updateData, { where });
            if (!updated) {
                return res.status(404).json({ success: false, message: 'Blog not found' });
            }
            const blog = await Blog.findOne({ where });
            res.json({ success: true, message: 'Blog updated successfully', data: blog });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteBlog: async (req, res) => {
        try {
            const where = tenantWhere(req, { id: req.params.id });
            const deleted = await Blog.destroy({ where });
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
            const { name, email, subject, message } = req.body;
            // Public contact form may send companyID; if authenticated non-super, force auth company
            const companyID = req.auth
                ? resolveCreateCompanyID(req, req.body.companyID)
                : req.body.companyID;
            const contact = await ContactMessage.create({ name, email, subject, message, companyID });
            res.status(201).json({ success: true, data: contact });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getContactMessages: async (req, res) => {
        try {
            let companyID = req.params.companyID;
            if ((companyID == null || companyID === '') && req.auth && !isSuperAdmin(req)) {
                companyID = req.auth.companyID;
            }
            const messages = await ContactMessage.findAll({ where: { companyID } });
            res.json({ success: true, data: messages });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // REVIEWS
    addReview: async (req, res) => {
        try {
            const { reviewerName, rating, reviewText, socialLink, userId } = req.body;
            const companyID = resolveCreateCompanyID(req, req.body.companyID);
            if (!companyID) {
                return res.status(400).json({ success: false, message: 'companyID is required' });
            }
            const review = await Review.create({
                reviewerName,
                rating,
                reviewText,
                socialLink,
                companyID,
                userId: userId || null
            });
            res.status(201).json({ success: true, data: review });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getReviews: async (req, res) => {
        try {
            let companyID = req.query.companyID || req.params.companyID;
            if ((companyID == null || companyID === '') && req.auth && !isSuperAdmin(req)) {
                companyID = req.auth.companyID;
            }
            const reviews = await Review.findAll({ where: { companyID } });
            res.json({ success: true, data: reviews });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    updateReview: async (req, res) => {
        try {
            const body = req.body || {};
            const updateData = {};
            if (body.reviewerName !== undefined) updateData.reviewerName = body.reviewerName;
            if (body.rating !== undefined) updateData.rating = body.rating;
            if (body.reviewText !== undefined) updateData.reviewText = body.reviewText;
            if (body.socialLink !== undefined) updateData.socialLink = body.socialLink;
            if (body.isActive !== undefined) updateData.isActive = body.isActive;

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ success: false, message: 'No fields to update' });
            }
            const where = tenantWhere(req, { id: req.params.id });
            const [updated] = await Review.update(updateData, { where });
            if (!updated) {
                return res.status(404).json({ success: false, message: 'Review not found' });
            }
            const review = await Review.findOne({ where });
            res.json({ success: true, message: 'Review updated successfully', data: review });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteReview: async (req, res) => {
        try {
            const where = tenantWhere(req, { id: req.params.id });
            const deleted = await Review.destroy({ where });
            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Review not found' });
            }
            res.json({ success: true, message: 'Review deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // TEAM MEMBERS
    addTeamMember: async (req, res) => {
        try {
            const { name, designation, bio, phoneNumber, tags } = req.body;
            const imageUrl = req.file ? req.file.filename : (req.body.imageUrl || null);
            const companyID = resolveCreateCompanyID(req, req.body.companyID);
            if (!companyID) return res.status(400).json({ success: false, message: 'companyID is required' });
            const member = await TeamMember.create({ name, designation, bio, phoneNumber, tags, companyID, imageUrl });
            res.status(201).json({ success: true, data: member });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    getTeamMembers: async (req, res) => {
        try {
            let { companyID } = req.params;
            if ((companyID == null || companyID === '') && req.auth && !isSuperAdmin(req)) {
                companyID = req.auth.companyID;
            }
            const members = await TeamMember.findAll({ where: { companyID } });
            res.json({ success: true, data: members });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    updateTeamMember: async (req, res) => {
        try {
            const updateData = {};
            const { name, designation, bio, phoneNumber, tags, isActive } = req.body;
            if (name !== undefined) updateData.name = name;
            if (designation !== undefined) updateData.designation = designation;
            if (bio !== undefined) updateData.bio = bio;
            if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
            if (tags !== undefined) updateData.tags = tags;
            if (isActive !== undefined) updateData.isActive = isActive;

            if (req.file) {
                updateData.imageUrl = req.file.filename;
            } else if (req.body.imageUrl !== undefined) {
                updateData.imageUrl = req.body.imageUrl;
            }

            const where = tenantWhere(req, { id: req.params.id });
            const [updated] = await TeamMember.update(updateData, { where });
            if (!updated) {
                return res.status(404).json({ success: false, message: 'Member not found' });
            }
            const member = await TeamMember.findOne({ where });
            res.json({ success: true, data: member });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    deleteTeamMember: async (req, res) => {
        try {
            const where = tenantWhere(req, { id: req.params.id });
            const deleted = await TeamMember.destroy({ where });
            if (!deleted) return res.status(404).json({ success: false, message: 'Member not found' });
            res.json({ success: true, message: 'Member deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};


module.exports = contentController;
