const express = require('express');
const router = express.Router();
const rbacController = require('../controllers/rbacController');
const { authenticate, requireRoles } = require('../middleware/auth');

router.use(authenticate);

router.get('/permissions', rbacController.listPermissions);
router.get('/roles', rbacController.listRoles);
router.post('/roles', requireRoles('admin', 'super_admin'), rbacController.createRole);
router.put('/roles/:id', requireRoles('admin', 'super_admin'), rbacController.updateRole);
router.delete('/roles/:id', requireRoles('admin', 'super_admin'), rbacController.deleteRole);
router.get('/users/:userId/permissions', rbacController.getUserPermissions);
router.put('/users/:userId/roles', requireRoles('admin', 'super_admin'), rbacController.assignUserRoles);
router.get('/matrix', rbacController.getMatrix);

module.exports = router;
