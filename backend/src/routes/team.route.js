const express = require('express');
const teamController = require('../controllers/team.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

router.get('/', teamController.getAllTeams);
router.get('/unassigned-users', requireRole(['admin', 'manager']), teamController.getUnassignedUsers);
router.post('/', requireRole(['admin', 'manager']), teamController.createTeam);
router.post('/:teamId/members', requireRole(['admin', 'manager']), teamController.addMemberToTeam);
router.delete('/:teamId/members/:userId', requireRole(['admin', 'manager']), teamController.removeMemberFromTeam);

module.exports = router;