const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['corrective', 'preventive'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  equipmentId: {
    type: String,
    required: false
  },
  equipmentName: {
    type: String,
    required: true
  },
  teamId: {
    type: String,
    required: false
  },
  teamName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'repaired', 'scrap'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedToName: {
    type: String,
    default: null
  },
  scheduledDate: {
    type: Date,
    default: null
  },
  duration: {
    type: Number, // in hours
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);