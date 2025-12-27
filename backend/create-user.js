const mongoose = require('mongoose');
const User = require('./src/models/user.model');
require('dotenv').config();

async function createUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Delete existing user if any
    await User.deleteOne({ email: 'user@gearguard.com' });
    console.log('Deleted existing user if any');
    
    // Create new user
    const user = await User.create({
      name: 'Test User',
      email: 'user@gearguard.com',
      password: 'Aditya#17',
      role: 'user',
      status: 'active',
      isVerified: true
    });
    
    console.log('User created successfully:', { 
      id: user._id,
      email: user.email, 
      role: user.role,
      status: user.status 
    });
    
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createUser();