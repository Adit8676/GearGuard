const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: [true, 'Equipment is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EquipmentCategory'
  },
  requestType: {
    type: String,
    enum: ['corrective', 'preventive'],
    required: [true, 'Request type is required'],
    default: 'corrective'
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaintenanceTeam'
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required'],
    default: Date.now
  },
  duration: {
    type: Number,
    default: 0,
    min: 0
  },
  stage: {
    type: String,
    enum: ['new', 'in_progress', 'repaired', 'scrap'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'very_high'],
    default: 'normal'
  },
  description: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  completedDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster queries
maintenanceRequestSchema.index({ stage: 1, scheduledDate: -1 });
maintenanceRequestSchema.index({ equipment: 1 });
maintenanceRequestSchema.index({ team: 1 });

// Virtual for checking if overdue
maintenanceRequestSchema.virtual('isOverdue').get(function() {
  if (this.stage === 'repaired' || this.stage === 'scrap') {
    return false;
  }
  return this.scheduledDate < new Date();
});

// Pre-save middleware to update completed date
maintenanceRequestSchema.pre('save', function(next) {
  if (this.isModified('stage')) {
    if (this.stage === 'repaired' || this.stage === 'scrap') {
      this.completedDate = new Date();
    }
  }
  next();
});

maintenanceRequestSchema.set('toJSON', { virtuals: true });
maintenanceRequestSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
