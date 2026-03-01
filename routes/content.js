const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const upload = require('../middleware/upload');

// Project Routes
router.post('/projects', upload.single('image'), contentController.addProject);
router.get('/projects/:companyID', contentController.getProjects);
router.put('/projects/:id', upload.single('image'), contentController.updateProject);
router.delete('/projects/:id', contentController.deleteProject);

// Banner Routes
router.post('/banners', upload.single('image'), contentController.addBanner);
router.get('/banners/:companyID', contentController.getBanners);
// PATCH without multer: use for JSON-only updates (e.g. isActive) so body is not consumed
router.patch('/banners/:id', contentController.updateBanner);
router.put('/banners/:id', upload.single('image'), contentController.updateBanner);
router.delete('/banners/:id', contentController.deleteBanner);

// Service Routes
router.post('/services', upload.single('image'), contentController.addService);
router.get('/services/:companyID', contentController.getServices);
router.put('/services/:id', upload.single('image'), contentController.updateService);
router.delete('/services/:id', contentController.deleteService);

// Blog Routes
router.post('/blogs', upload.single('image'), contentController.addBlog);
router.get('/blogs/:companyID', contentController.getBlogs);
router.put('/blogs/:id', upload.single('image'), contentController.updateBlog);
router.delete('/blogs/:id', contentController.deleteBlog);

// Contact Routes
router.post('/contact', contentController.addContactMessage);
router.get('/contact/:companyID', contentController.getContactMessages);

module.exports = router;
