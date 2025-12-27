const express = require('express');
const userController = require('../controllers/user.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require admin role
router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/', userController.getAllUsers);
router.put('/:userId/upgrade-role', userController.upgradeUserRole);
router.put('/:userId/disable', userController.disableUser);
router.put('/:userId/enable', userController.enableUser);

module.exports = router;