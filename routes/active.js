const express = require('express');
const router = express.Router();
const activeController = require('../controllers/activeController');

// Active list only (isActive: 1) - optional ?category= for filter
router.get('/banners/:companyID', activeController.getActiveBanners);
router.get('/projects/:companyID', activeController.getActiveProjects);
router.get('/services/:companyID', activeController.getActiveServices);
router.get('/blogs/:companyID', activeController.getActiveBlogs);

module.exports = router;
