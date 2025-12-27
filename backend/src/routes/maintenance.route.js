const express = require('express');
const maintenanceController = require('../controllers/maintenance.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

router.get('/', maintenanceController.getAllRequests);
router.get('/my', maintenanceController.getMyRequests);
router.get('/equipment', maintenanceController.getEquipment);
router.post('/', maintenanceController.createRequest);
router.patch('/:id/status', requireRole(['admin', 'manager', 'technician']), maintenanceController.updateStatus);

module.exports = router;