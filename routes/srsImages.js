const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const srsImageController = require('../controllers/srsImageController');

// GET /srs-images/all - get all SRS images
router.get('/all', srsImageController.getAllSrsImages);

// GET /srs-images?companyID=1&userId=1
router.get('/', srsImageController.getSrsImages);

// GET /srs-images/:id
router.get('/:id', srsImageController.getSrsImageById);

// POST /srs-images (payload: companyID, userId; optional: file or imagePath)
router.post('/', upload.any(), srsImageController.addSrsImage);

// PUT /srs-images/:id
router.put('/:id', upload.any(), srsImageController.updateSrsImage);

// DELETE /srs-images/:id
router.delete('/:id', srsImageController.deleteSrsImage);

module.exports = router;
