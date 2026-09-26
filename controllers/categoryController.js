const Category = require('../models/category');
const { tenantWhere, forceBodyCompany } = require('../middleware/auth');

const categoryController = {
    getAllCategories: async (req, res) => {
        try {
            const where = req.auth ? tenantWhere(req) : {};
            const categories = await Category.findAll({ where });
            res.json({ success: true, data: categories });
        } catch (error) {
            console.error('getAllCategories error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    createCategory: async (req, res) => {
        try {
            forceBodyCompany(req);
            const companyID = req.body.companyID ?? req.auth?.companyID;
            if (companyID == null) {
                return res.status(400).json({ success: false, message: 'companyID is required' });
            }
            const name = req.body.name;
            if (!name) {
                return res.status(400).json({ success: false, message: 'name is required' });
            }
            const category = await Category.create({
                name,
                companyID,
                isActive: req.body.isActive != null ? Number(req.body.isActive) : 1,
                CreatedOn: new Date(),
            });
            res.status(201).json({ success: true, data: category });
        } catch (error) {
            console.error('createCategory error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const id = req.params.id;
            const where = req.auth ? tenantWhere(req, { id }) : { id };
            const category = await Category.findOne({ where });
            if (!category) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }
            const updates = {};
            if (req.body.name != null) updates.name = req.body.name;
            if (req.body.isActive != null) updates.isActive = Number(req.body.isActive);
            await category.update(updates);
            res.json({ success: true, data: category });
        } catch (error) {
            console.error('updateCategory error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const id = req.params.id;
            const where = req.auth ? tenantWhere(req, { id }) : { id };
            const category = await Category.findOne({ where });
            if (!category) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }
            await category.destroy();
            res.json({ success: true, message: 'Category deleted' });
        } catch (error) {
            console.error('deleteCategory error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },
};

module.exports = categoryController;
