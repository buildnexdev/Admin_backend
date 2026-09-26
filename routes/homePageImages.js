const express = require('express');
const upload = require('../middleware/upload');
const {
    uploadHomePageImage,
    getHomePageImages
} = require('../controllers/homePageImageController');
const { authenticate, requireCompanyAccess } = require('../middleware/auth');

const router = express.Router();

// POST /home-page/upload-image — write endpoint requires auth
router.post('/upload-image', authenticate, requireCompanyAccess, upload.single('imageUrl'), uploadHomePageImage);

// GET /home-page/images — public read for websites
router.get('/images', getHomePageImages);

module.exports = router;
