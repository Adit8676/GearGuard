const Team = require('../models/team.model');
const User = require('../models/user.model');

class TeamController {
  async getAllTeams(req, res) {
    try {
      const teams = await Team.find().populate('members', 'name email role');
      res.json({ ok: true, teams });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }

  async getUnassignedUsers(req, res) {
    try {
      // Get all team member IDs
      const teams = await Team.find();
      const assignedUserIds = teams.reduce((acc, team) => {
        return acc.concat(team.members);
      }, []);

      // Find technicians and managers not in any team
      const unassignedUsers = await User.find({
        _id: { $nin: assignedUserIds },
        role: { $in: ['technician', 'manager'] },
        status: 'active'
      }).select('name email role');

      res.json({ ok: true, unassignedUsers });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }

  async createTeam(req, res) {
    try {
      const { name, description, members } = req.body;

      if (!name) {
        return res.status(400).json({ ok: false, message: 'Team name is required' });
      }

      // Check if team name already exists
      const existingTeam = await Team.findOne({ name });
      if (existingTeam) {
        return res.status(400).json({ ok: false, message: 'Team name already exists' });
      }

      // Validate at least one technician
      if (members && members.length > 0) {
        const users = await User.find({ _id: { $in: members } });
        const hasTechnician = users.some(user => user.role === 'technician');
        if (!hasTechnician) {
          return res.status(400).json({ ok: false, message: 'Team must have at least one technician' });
        }
      }

      const team = await Team.create({
        name,
        description,
        members: members || []
      });

      const populatedTeam = await Team.findById(team._id).populate('members', 'name email role');
      res.status(201).json({ ok: true, team: populatedTeam });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }

  async addMemberToTeam(req, res) {
    try {
      const { teamId } = req.params;
      const { userId } = req.body;

      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ ok: false, message: 'Team not found' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ ok: false, message: 'User not found' });
      }

      // Check if user is already in a team
      const existingTeam = await Team.findOne({ members: userId });
      if (existingTeam) {
        return res.status(400).json({ ok: false, message: 'User is already assigned to a team' });
      }

      // Add user to team
      team.members.push(userId);
      await team.save();

      const updatedTeam = await Team.findById(teamId).populate('members', 'name email role');
      res.json({ ok: true, team: updatedTeam });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }

  async removeMemberFromTeam(req, res) {
    try {
      const { teamId, userId } = req.params;

      const team = await Team.findById(teamId).populate('members', 'role');
      if (!team) {
        return res.status(404).json({ ok: false, message: 'Team not found' });
      }

      const userToRemove = team.members.find(member => member._id.toString() === userId);
      if (!userToRemove) {
        return res.status(404).json({ ok: false, message: 'User not found in team' });
      }

      // Check if removing this user would leave team without technicians
      const remainingMembers = team.members.filter(member => member._id.toString() !== userId);
      const hasTechnician = remainingMembers.some(member => member.role === 'technician');
      
      if (!hasTechnician && userToRemove.role === 'technician') {
        return res.status(400).json({ ok: false, message: 'Cannot remove the last technician from team' });
      }

      // Remove user from team
      team.members = team.members.filter(member => member._id.toString() !== userId);
      await team.save();

      const updatedTeam = await Team.findById(teamId).populate('members', 'name email role');
      res.json({ ok: true, team: updatedTeam });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
}

module.exports = new TeamController();