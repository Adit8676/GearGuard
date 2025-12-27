const express = require('express');
const router = express.Router();
const {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember
} = require('../controllers/teamController');

router.route('/')
  .get(getAllTeams)
  .post(createTeam);

router.route('/:id')
  .get(getTeamById)
  .put(updateTeam)
  .delete(deleteTeam);

router.post('/:id/members', addTeamMember);
router.delete('/:id/members/:userId', removeTeamMember);

module.exports = router;
