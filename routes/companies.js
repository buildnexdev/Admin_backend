const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticate, requireRoles, requireCompanyAccess } = require('../middleware/auth');

router.use(authenticate);

router.get('/', requireRoles('super_admin'), companyController.getAllCompanies);
router.get('/:companyID', requireCompanyAccess, companyController.getCompanyByID);
router.post('/', requireRoles('super_admin'), companyController.createCompany);
router.put('/:companyID', requireRoles('admin', 'super_admin'), requireCompanyAccess, companyController.updateCompany);

module.exports = router;
