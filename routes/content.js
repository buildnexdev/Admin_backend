const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const upload = require('../middleware/upload');

// Project Routes
router.post('/projects', upload.single('image'), contentController.addProject);
router.get('/projects/:companyID', contentController.getProjects);

// Banner Routes
router.post('/banners', upload.single('image'), contentController.addBanner);
router.get('/banners/:companyID', contentController.getBanners);

// Service Routes
router.post('/services', contentController.addService);
router.get('/services/:companyID', contentController.getServices);

// Blog Routes
router.post('/blogs', upload.single('image'), contentController.addBlog);
router.get('/blogs/:companyID', contentController.getBlogs);

// Contact Routes
router.post('/contact', contentController.addContactMessage);
router.get('/contact/:companyID', contentController.getContactMessages);

module.exports = router;
