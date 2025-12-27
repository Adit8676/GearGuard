const User = require('../models/user.model');
const MaintenanceRequest = require('../models/maintenanceRequest.model');
const Equipment = require('../models/equipment.model');
const Team = require('../models/team.model');

class AdminController {
  async getStats(req, res) {
    try {
      const totalUsers = await User.countDocuments();
      const totalEquipment = 0; // Will implement when Equipment model is created
      const openRequests = 0; // Will implement when MaintenanceRequest model is created
      const activeTechnicians = await User.countDocuments({ role: 'technician' });

      res.json({
        ok: true,
        stats: {
          totalUsers,
          totalEquipment,
          openRequests,
          activeTechnicians
        }
      });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Failed to fetch stats' });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      res.json({ ok: true, users });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Failed to fetch users' });
    }
  }

  async updateUserRole(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!['user', 'technician', 'manager', 'admin'].includes(role)) {
        return res.status(400).json({ ok: false, message: 'Invalid role' });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ ok: false, message: 'User not found' });
      }

      res.json({ ok: true, user });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Failed to update user role' });
    }
  }

  async getTeams(req, res) {
    try {
      // Return empty array until Team model is implemented
      const teams = [];
      res.json({ ok: true, teams });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Failed to fetch teams' });
    }
  }

  async createTeam(req, res) {
    try {
      // Return success but don't actually create until Team model exists
      res.json({ ok: true, message: 'Team creation will be available when Team model is implemented' });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Failed to create team' });
    }
  }

  async getEquipment(req, res) {
    try {
      const equipment = await Equipment.find()
        .populate('assignedTeamId', 'name')
        .select('name assignedTeamId')
        .sort({ name: 1 });

      const formattedEquipment = equipment.map(eq => ({
        _id: eq._id,
        name: eq.name,
        teamId: eq.assignedTeamId?._id,
        teamName: eq.assignedTeamId?.name
      }));

      res.json({ ok: true, equipment: formattedEquipment });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Failed to fetch equipment' });
    }
  }

  async createMaintenanceRequest(req, res) {
    try {
      const { subject, description, type, priority, equipmentId } = req.body;

      // Get equipment details
      const equipment = await Equipment.findById(equipmentId).populate('assignedTeamId');
      if (!equipment) {
        return res.status(404).json({ ok: false, message: 'Equipment not found' });
      }

      // Get team details
      const team = await Team.findById(equipment.assignedTeamId);
      if (!team) {
        return res.status(404).json({ ok: false, message: 'Team not found' });
      }

      const maintenanceRequest = await MaintenanceRequest.create({
        subject,
        description,
        type,
        priority: priority || 'medium',
        equipmentId,
        equipmentName: equipment.name,
        teamId: team._id,
        teamName: team.name,
        createdBy: req.user._id
      });

      res.status(201).json({ ok: true, request: maintenanceRequest });
    } catch (error) {
      console.error('Create request error:', error);
      res.status(500).json({ ok: false, message: 'Failed to create maintenance request' });
    }
  }
}

module.exports = new AdminController();