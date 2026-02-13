const express = require('express');
const upload = require('../middleware/upload');
const {
    uploadHomePageImage,
    getHomePageImages
} = require('../controllers/homePageImageController');

const router = express.Router();

// POST /home-page/upload-image
router.post('/upload-image', upload.single('imageUrl'), uploadHomePageImage);

// GET /home-page/images
router.get('/images', getHomePageImages);

module.exports = router;

