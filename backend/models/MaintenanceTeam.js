const mongoose = require('mongoose');

const maintenanceTeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    unique: true,
    trim: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  active: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: '#3498db'
  }
}, {
  timestamps: true
});

// Virtual for equipment count
maintenanceTeamSchema.virtual('equipmentCount', {
  ref: 'Equipment',
  localField: '_id',
  foreignField: 'team',
  count: true
});

// Virtual for request count
maintenanceTeamSchema.virtual('requestCount', {
  ref: 'MaintenanceRequest',
  localField: '_id',
  foreignField: 'team',
  count: true
});

maintenanceTeamSchema.set('toJSON', { virtuals: true });
maintenanceTeamSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('MaintenanceTeam', maintenanceTeamSchema);
