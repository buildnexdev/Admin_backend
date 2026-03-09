const Category = require('../models/category');

const categoryController = {
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.findAll();
            res.json({ success: true, data: categories });
        } catch (error) {
            console.error('getAllCategories error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = categoryController;
