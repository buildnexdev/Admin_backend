const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Get all menus
router.get('/', menuController.getAllMenus);

// Get menu by companyID
router.get('/:companyID', menuController.getMenuByCompanyID);

module.exports = router;
