const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');

// List with query params (must be before /:id routes)
// GET /quotation?userId=1&category=Builders&companyID=1
router.get('/', quotationController.getQuotationsByQuery);

// Client link (when client clicks link, count increments)
router.get('/view/:id', quotationController.viewQuotation);
// Also support /:id/view format and POST method for API
router.get('/:id/view', quotationController.viewQuotation);
router.post('/:id/view', quotationController.viewQuotation);

// List all quotations for company (admin)
router.get('/list/:companyID', quotationController.listQuotations);

// Stats: view count for UI (must be before /:id)
router.get('/:id/stats', quotationController.getQuotationStats);

// Get single quotation by id (admin / fallback - has link_click_count)
router.get('/:id', quotationController.getQuotationById);

// Update quotation
router.put('/:id', quotationController.updateQuotation);

// Delete quotation
router.delete('/:id', quotationController.deleteQuotation);

// Create quotation
router.post('/', quotationController.createQuotation);

module.exports = router;
