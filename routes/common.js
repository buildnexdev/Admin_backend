const express = require('express');
const router = express.Router();
const commonController = require('../controllers/commonController');

// Image upload route
router.post('/uploadImageToServer', commonController.uploadImageToServer);

module.exports = router;
