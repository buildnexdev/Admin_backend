const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { authenticate, requireCompanyAccess } = require('../middleware/auth');

// Save banner paths — write endpoint requires auth + company access
router.post('/save-paths', authenticate, requireCompanyAccess, contentController.saveBannerPaths);

module.exports = router;
