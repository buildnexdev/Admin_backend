const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');
const { authenticate, requireCompanyAccess, optionalAuth } = require('../middleware/auth');

// Public client view + stats (token-based)
router.get('/stats/:token', quotationController.getQuotationStatsByToken);
router.get('/view/:id', quotationController.viewQuotation);
router.get('/:id/view', quotationController.viewQuotation);
router.post('/:id/view', quotationController.viewQuotation);

// Admin management
router.get('/', authenticate, requireCompanyAccess, quotationController.getQuotationsByQuery);
router.get('/list/:companyID', authenticate, requireCompanyAccess, quotationController.listQuotations);
router.get('/:id/stats', authenticate, requireCompanyAccess, quotationController.getQuotationStats);
router.get('/:id', optionalAuth, quotationController.getQuotationById);
router.put('/:id', authenticate, requireCompanyAccess, quotationController.updateQuotation);
router.delete('/:id', authenticate, requireCompanyAccess, quotationController.deleteQuotation);
router.post('/', authenticate, requireCompanyAccess, quotationController.createQuotation);

module.exports = router;
