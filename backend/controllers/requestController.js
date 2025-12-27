const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');

// @desc    Get all maintenance requests
// @route   GET /api/requests
exports.getAllRequests = async (req, res) => {
  try {
    const { stage, team, requestType, equipment } = req.query;
    
    let query = {};
    
    if (stage) query.stage = stage;
    if (team) query.team = team;
    if (requestType) query.requestType = requestType;
    if (equipment) query.equipment = equipment;

    const requests = await MaintenanceRequest.find(query)
      .populate('equipment', 'name serialNumber')
      .populate('category', 'name')
      .populate('team', 'name')
      .populate('assignedTechnician', 'name email')
      .populate('createdBy', 'name email')
      .sort({ scheduledDate: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single maintenance request
// @route   GET /api/requests/:id
exports.getRequestById = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('equipment', 'name serialNumber location')
      .populate('category', 'name')
      .populate('team', 'name members')
      .populate('assignedTechnician', 'name email phone')
      .populate('createdBy', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new maintenance request
// @route   POST /api/requests
exports.createRequest = async (req, res) => {
  try {
    // Auto-fill team and category from equipment
    if (req.body.equipment) {
      const equipment = await Equipment.findById(req.body.equipment)
        .populate('team')
        .populate('category')
        .populate('defaultTechnician');
      
      if (equipment) {
        req.body.team = equipment.team._id;
        req.body.category = equipment.category._id;
        
        // Auto-assign default technician if not specified
        if (!req.body.assignedTechnician && equipment.defaultTechnician) {
          req.body.assignedTechnician = equipment.defaultTechnician._id;
        }
      }
    }

    const request = await MaintenanceRequest.create(req.body);
    
    const populatedRequest = await MaintenanceRequest.findById(request._id)
      .populate('equipment', 'name serialNumber')
      .populate('category', 'name')
      .populate('team', 'name')
      .populate('assignedTechnician', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedRequest
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update maintenance request
// @route   PUT /api/requests/:id
exports.updateRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('equipment', 'name serialNumber')
      .populate('category', 'name')
      .populate('team', 'name')
      .populate('assignedTechnician', 'name email')
      .populate('createdBy', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    // If moved to scrap, update equipment status
    if (req.body.stage === 'scrap') {
      await Equipment.findByIdAndUpdate(request.equipment._id, {
        status: 'scrapped'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete maintenance request
// @route   DELETE /api/requests/:id
exports.deleteRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    res.json({
      success: true,
      message: 'Maintenance request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get requests by stage
// @route   GET /api/requests/stage/:stage
exports.getRequestsByStage = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ stage: req.params.stage })
      .populate('equipment', 'name serialNumber')
      .populate('assignedTechnician', 'name email')
      .populate('team', 'name')
      .sort({ scheduledDate: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get statistics
// @route   GET /api/requests/stats
exports.getRequestStats = async (req, res) => {
  try {
    const stats = await MaintenanceRequest.aggregate([
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 }
        }
      }
    ]);

    const typeStats = await MaintenanceRequest.aggregate([
      {
        $group: {
          _id: '$requestType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        byStage: stats,
        byType: typeStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
