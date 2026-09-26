const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { authenticate, requireCompanyAccess } = require('../middleware/auth');

router.use(authenticate);
router.get('/', requireCompanyAccess, menuController.getAllMenus);
router.get('/:companyID', requireCompanyAccess, menuController.getMenuByCompanyID);

module.exports = router;
