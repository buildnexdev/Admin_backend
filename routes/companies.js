const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

router.get('/', companyController.getAllCompanies);
router.get('/:companyID', companyController.getCompanyByID);
router.post('/', companyController.createCompany);
router.put('/:companyID', companyController.updateCompany);

module.exports = router;
