const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');

// @desc    Get all equipment
// @route   GET /api/equipment
exports.getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find()
      .populate('category', 'name')
      .populate('team', 'name')
      .populate('assignedEmployee', 'name email')
      .populate('defaultTechnician', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: equipment.length,
      data: equipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single equipment
// @route   GET /api/equipment/:id
exports.getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('category', 'name')
      .populate('team', 'name members')
      .populate('assignedEmployee', 'name email')
      .populate('defaultTechnician', 'name email');
    
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    // Get maintenance requests for this equipment
    const requests = await MaintenanceRequest.find({ equipment: req.params.id })
      .populate('assignedTechnician', 'name')
      .sort({ scheduledDate: -1 });

    res.json({
      success: true,
      data: {
        ...equipment.toObject(),
        maintenanceRequests: requests
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new equipment
// @route   POST /api/equipment
exports.createEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.create(req.body);
    
    const populatedEquipment = await Equipment.findById(equipment._id)
      .populate('category', 'name')
      .populate('team', 'name')
      .populate('assignedEmployee', 'name email')
      .populate('defaultTechnician', 'name email');

    res.status(201).json({
      success: true,
      data: populatedEquipment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
exports.updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('category', 'name')
      .populate('team', 'name')
      .populate('assignedEmployee', 'name email')
      .populate('defaultTechnician', 'name email');

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    res.json({
      success: true,
      data: equipment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    res.json({
      success: true,
      message: 'Equipment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get equipment by department
// @route   GET /api/equipment/department/:department
exports.getEquipmentByDepartment = async (req, res) => {
  try {
    const equipment = await Equipment.find({ department: req.params.department })
      .populate('category', 'name')
      .populate('team', 'name')
      .populate('assignedEmployee', 'name email');

    res.json({
      success: true,
      count: equipment.length,
      data: equipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
