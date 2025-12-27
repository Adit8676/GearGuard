const MaintenanceRequest = require('../models/maintenanceRequest.model');
const Equipment = require('../models/equipment.model');
const Team = require('../models/team.model');
const User = require('../models/user.model');

class MaintenanceController {
  async getAllRequests(req, res) {
    try {
      const requests = await MaintenanceRequest.find()
        .populate('equipmentId', 'name')
        .populate('teamId', 'name')
        .populate('assignedTo', 'name')
        .sort({ createdAt: -1 });

      res.json({ ok: true, requests });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }

  async getMyRequests(req, res) {
    try {
      const requests = await MaintenanceRequest.find({ createdBy: req.user._id })
        .populate('equipmentId', 'name')
        .populate('teamId', 'name')
        .populate('assignedTo', 'name')
        .sort({ createdAt: -1 });

      res.json({ ok: true, requests });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Server error' });
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
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }

  async createRequest(req, res) {
    try {
      console.log('=== CREATE REQUEST DEBUG ===');
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      console.log('User:', req.user ? req.user._id : 'No user');
      
      const { subject, description, type, priority, equipmentName, teamName } = req.body;

      if (!req.user || !req.user._id) {
        console.log('ERROR: No authenticated user');
        return res.status(401).json({ ok: false, message: 'User not authenticated' });
      }

      const requestData = {
        subject: subject || 'Maintenance Request',
        description: description || '',
        type: type || 'corrective',
        priority: priority || 'medium',
        equipmentName: equipmentName || 'Unknown Equipment',
        teamName: teamName || 'General Team',
        createdBy: req.user._id
      };

      console.log('Creating request with data:', JSON.stringify(requestData, null, 2));
      
      const maintenanceRequest = await MaintenanceRequest.create(requestData);
      console.log('Request created successfully:', maintenanceRequest._id);

      res.status(201).json({ ok: true, request: maintenanceRequest });
    } catch (error) {
      console.error('=== CREATE REQUEST ERROR ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      res.status(500).json({ ok: false, message: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, assignedTo } = req.body;

      const validStatuses = ['new', 'in_progress', 'repaired', 'scrap'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ ok: false, message: 'Invalid status' });
      }

      const updateData = { status };
      
      if (assignedTo) {
        const technician = await User.findById(assignedTo);
        if (technician) {
          updateData.assignedTo = assignedTo;
          updateData.assignedToName = technician.name;
        }
      }

      const request = await MaintenanceRequest.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).populate('equipmentId', 'name')
       .populate('teamId', 'name')
       .populate('assignedTo', 'name');

      if (!request) {
        return res.status(404).json({ ok: false, message: 'Request not found' });
      }

      res.json({ ok: true, request });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
}

module.exports = new MaintenanceController();