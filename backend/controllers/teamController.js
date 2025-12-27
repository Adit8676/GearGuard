const MaintenanceTeam = require('../models/MaintenanceTeam');

// @desc    Get all teams
// @route   GET /api/teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await MaintenanceTeam.find()
      .populate('members', 'name email role')
      .sort({ name: 1 });

    res.json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single team
// @route   GET /api/teams/:id
exports.getTeamById = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findById(req.params.id)
      .populate('members', 'name email role phone');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new team
// @route   POST /api/teams
exports.createTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.create(req.body);
    
    const populatedTeam = await MaintenanceTeam.findById(team._id)
      .populate('members', 'name email role');

    res.status(201).json({
      success: true,
      data: populatedTeam
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
exports.updateTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('members', 'name email role');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
exports.deleteTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add member to team
// @route   POST /api/teams/:id/members
exports.addTeamMember = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const team = await MaintenanceTeam.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await team.save();
    }

    const updatedTeam = await MaintenanceTeam.findById(req.params.id)
      .populate('members', 'name email role');

    res.json({
      success: true,
      data: updatedTeam
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:userId
exports.removeTeamMember = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    team.members = team.members.filter(
      member => member.toString() !== req.params.userId
    );
    await team.save();

    const updatedTeam = await MaintenanceTeam.findById(req.params.id)
      .populate('members', 'name email role');

    res.json({
      success: true,
      data: updatedTeam
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
