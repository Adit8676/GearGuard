const mongoose = require('mongoose');
const User = require('./src/models/user.model');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Delete existing admin if any
    await User.deleteOne({ email: process.env.ADMIN_EMAIL || 'admin@gearguard.com' });
    console.log('Deleted existing admin if any');
    
    // Create new admin
    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'System Admin',
      email: process.env.ADMIN_EMAIL || 'admin@gearguard.com',
      password: process.env.ADMIN_PASSWORD || 'Admin123!',
      role: 'admin',
      status: 'active',
      isVerified: true
    });
    
    console.log('Admin created successfully:', { 
      id: admin._id,
      email: admin.email, 
      role: admin.role,
      status: admin.status 
    });
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();