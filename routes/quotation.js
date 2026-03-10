const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');

// List with query params (must be before /:id routes)
// GET /quotation?userId=1&category=Builders&companyID=1
router.get('/', quotationController.getQuotationsByQuery);

// List all quotations for company (admin)
router.get('/list/:companyID', quotationController.listQuotations);

// Stats by token (recommended: no conflict with :id) - GET /quotation/stats/7f5a7020-ab99-4c17-a260-9eccbe35f1e0
router.get('/stats/:token', quotationController.getQuotationStatsByToken);

// Client link (when client clicks link, count increments)
router.get('/view/:id', quotationController.viewQuotation);
router.get('/:id/view', quotationController.viewQuotation);
router.post('/:id/view', quotationController.viewQuotation);

// Stats by id or token - GET /quotation/:id/stats
router.get('/:id/stats', quotationController.getQuotationStats);

// Get single quotation by id or token (admin / fallback)
router.get('/:id', quotationController.getQuotationById);

// Update quotation
router.put('/:id', quotationController.updateQuotation);

// Delete quotation
router.delete('/:id', quotationController.deleteQuotation);

// Create quotation
router.post('/', quotationController.createQuotation);

module.exports = router;
