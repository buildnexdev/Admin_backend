const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const upload = require('../middleware/upload');
const { authenticate, requireCompanyAccess, optionalAuth } = require('../middleware/auth');

// Public endpoints (website / review form)
router.post('/contact', contentController.addContactMessage);
router.post('/reviews', contentController.addReview);

// All management endpoints require auth + company isolation
router.use(authenticate);

// Project Routes
router.post('/projects', requireCompanyAccess, upload.single('image'), contentController.addProject);
router.get('/projects/:companyID', requireCompanyAccess, contentController.getProjects);
router.put('/projects/:id', requireCompanyAccess, upload.single('image'), contentController.updateProject);
router.delete('/projects/:id', requireCompanyAccess, contentController.deleteProject);

// Banner Routes
router.post('/banners', requireCompanyAccess, upload.single('image'), contentController.addBanner);
router.get('/banners/:companyID', requireCompanyAccess, contentController.getBanners);
router.patch('/banners/:id', requireCompanyAccess, contentController.updateBanner);
router.put('/banners/:id', requireCompanyAccess, upload.single('image'), contentController.updateBanner);
router.delete('/banners/:id', requireCompanyAccess, contentController.deleteBanner);

// Service Routes
router.post('/services', requireCompanyAccess, upload.single('image'), contentController.addService);
router.get('/services/:companyID', requireCompanyAccess, contentController.getServices);
router.put('/services/:id', requireCompanyAccess, upload.single('image'), contentController.updateService);
router.delete('/services/:id', requireCompanyAccess, contentController.deleteService);

// Blog Routes
router.post('/blogs', requireCompanyAccess, upload.single('image'), contentController.addBlog);
router.get('/blogs/:companyID', requireCompanyAccess, contentController.getBlogs);
router.put('/blogs/:id', requireCompanyAccess, upload.single('image'), contentController.updateBlog);
router.delete('/blogs/:id', requireCompanyAccess, contentController.deleteBlog);

// Contact (authenticated list)
router.get('/contact/:companyID', requireCompanyAccess, contentController.getContactMessages);

// Reviews
router.get('/reviews', contentController.getReviews);
router.get('/reviews/:companyID', requireCompanyAccess, contentController.getReviews);
router.put('/reviews/:id', requireCompanyAccess, contentController.updateReview);
router.delete('/reviews/:id', requireCompanyAccess, contentController.deleteReview);

// Team members
router.post('/team-members', requireCompanyAccess, upload.single('image'), contentController.addTeamMember);
router.get('/team-members/:companyID', requireCompanyAccess, contentController.getTeamMembers);
router.put('/team-members/:id', requireCompanyAccess, upload.single('image'), contentController.updateTeamMember);
router.delete('/team-members/:id', requireCompanyAccess, contentController.deleteTeamMember);

module.exports = router;
