const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// Save banner paths
router.post('/save-paths', contentController.saveBannerPaths);

module.exports = router;
