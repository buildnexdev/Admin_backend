const express = require('express');
const router = express.Router();
const commonController = require('../controllers/commonController');
const { authenticate, requireCompanyAccess } = require('../middleware/auth');

// Image upload route — authenticated; company in body validated when present
router.post('/uploadImageToServer', authenticate, requireCompanyAccess, commonController.uploadImageToServer);

module.exports = router;
