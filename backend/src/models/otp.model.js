const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 900 // 15 minutes in seconds
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Otp', otpSchema);