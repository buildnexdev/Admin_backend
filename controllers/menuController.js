const Menu = require('../models/menu');

/**
 * GET /menu/:companyID - Get menu settings for a company
 */
exports.getMenuByCompanyID = async (req, res) => {
    try {
        const companyID = req.params.companyID;
        if (!companyID) {
            return res.status(400).json({ success: false, message: 'companyID is required' });
        }

        const menu = await Menu.findOne({ where: { companyID } });

        if (!menu) {
            return res.status(404).json({ success: false, message: 'Menu settings not found for this company' });
        }

        res.json({ success: true, data: menu });
    } catch (error) {
        console.error('getMenuByCompanyID error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /menu - Get all menus (optional, just in case)
 */
exports.getAllMenus = async (req, res) => {
    try {
        const menus = await Menu.findAll();
        res.json({ success: true, data: menus });
    } catch (error) {
        console.error('getAllMenus error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
