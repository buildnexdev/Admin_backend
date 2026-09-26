const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, requireCompanyAccess } = require('../middleware/auth');

// Public/list — remaining GET can stay open for frontend selects
router.get('/', categoryController.getAllCategories);

router.post('/', authenticate, requireCompanyAccess, categoryController.createCategory);
router.put('/:id', authenticate, requireCompanyAccess, categoryController.updateCategory);
router.delete('/:id', authenticate, requireCompanyAccess, categoryController.deleteCategory);

module.exports = router;
