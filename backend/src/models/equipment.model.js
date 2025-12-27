const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  purchaseDate: {
    type: Date
  },
  warrantyTill: {
    type: Date
  },
  location: {
    type: String,
    trim: true
  },
  assignedTeamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'scrapped'],
    default: 'active'
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Equipment', equipmentSchema);