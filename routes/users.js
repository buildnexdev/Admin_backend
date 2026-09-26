const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, requireCompanyAccess, requireRoles } = require('../middleware/auth');

router.post('/login', userController.login);
router.get('/me', authenticate, userController.getMe);
router.post('/change-password', authenticate, userController.changePassword);
router.get('/staff', authenticate, requireCompanyAccess, userController.getStaff);
router.post('/staff', authenticate, requireCompanyAccess, requireRoles('admin', 'super_admin'), userController.createStaff);
router.put('/staff/:userId', authenticate, requireCompanyAccess, requireRoles('admin', 'super_admin'), userController.updateStaff);

module.exports = router;
