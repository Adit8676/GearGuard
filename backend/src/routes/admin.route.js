const express = require('express');
const adminController = require('../controllers/admin.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(requireAuth);
router.use(requireRole('admin'));

// Stats
router.get('/stats', adminController.getStats);

// Users
router.get('/users', adminController.getUsers);
router.patch('/users/:userId/role', adminController.updateUserRole);

// Teams
router.get('/teams', adminController.getTeams);
router.post('/teams', adminController.createTeam);

// Equipment
router.get('/equipment', adminController.getEquipment);

// Maintenance Requests
router.post('/maintenance', adminController.createMaintenanceRequest);

module.exports = router;