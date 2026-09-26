const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const srsImageController = require('../controllers/srsImageController');
const { authenticate, requireCompanyAccess } = require('../middleware/auth');

router.use(authenticate);

router.get('/all', requireCompanyAccess, srsImageController.getAllSrsImages);
router.get('/', requireCompanyAccess, srsImageController.getSrsImages);
router.get('/:id', requireCompanyAccess, srsImageController.getSrsImageById);
router.post('/', requireCompanyAccess, upload.any(), srsImageController.addSrsImage);
router.put('/:id', requireCompanyAccess, upload.any(), srsImageController.updateSrsImage);
router.delete('/:id', requireCompanyAccess, srsImageController.deleteSrsImage);

module.exports = router;
