const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Equipment name is required'],
    trim: true
  },
  serialNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EquipmentCategory',
    required: [true, 'Equipment category is required']
  },
  department: {
    type: String,
    trim: true
  },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaintenanceTeam',
    required: [true, 'Maintenance team is required']
  },
  defaultTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  purchaseDate: {
    type: Date
  },
  warrantyStartDate: {
    type: Date
  },
  warrantyEndDate: {
    type: Date
  },
  warrantyInfo: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['operational', 'under_maintenance', 'scrapped'],
    default: 'operational'
  }
}, {
  timestamps: true
});

// Virtual for maintenance requests
equipmentSchema.virtual('maintenanceRequests', {
  ref: 'MaintenanceRequest',
  localField: '_id',
  foreignField: 'equipment'
});

equipmentSchema.set('toJSON', { virtuals: true });
equipmentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
