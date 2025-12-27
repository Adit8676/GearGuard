const express = require('express');
const reportsController = require('../controllers/reports.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication and admin/manager role
router.use(requireAuth);
router.use(requireRole(['admin', 'manager']));

router.get('/summary', reportsController.getSummary);
router.get('/by-team', reportsController.getByTeam);
router.get('/monthly', reportsController.getMonthly);

module.exports = router;