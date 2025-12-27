const mongoose = require('mongoose');
const User = require('./src/models/user.model');
require('dotenv').config();

async function createTestUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Test users to create
    const testUsers = [
      {
        name: 'System Admin',
        email: 'admin@gearguard.com',
        password: 'Aditya#17',
        role: 'admin',
        status: 'active',
        isVerified: true
      },
      {
        name: 'John Technician',
        email: 'tech@gearguard.com',
        password: 'Aditya#17',
        role: 'technician',
        status: 'active',
        isVerified: true,
        teamName: 'Mechanical Team'
      },
      {
        name: 'Sarah Manager',
        email: 'manager@gearguard.com', 
        password: 'Aditya#17',
        role: 'manager',
        status: 'active',
        isVerified: true,
        teamName: 'Mechanical Team'
      },
      {
        name: 'Mike ITTech',
        email: 'ittech@gearguard.com',
        password: 'Aditya#17',
        role: 'technician', 
        status: 'active',
        isVerified: true,
        teamName: 'IT Support Team'
      },
      {
        name: 'Alex Mechanic',
        email: 'alex@gearguard.com',
        password: 'Aditya#17',
        role: 'technician',
        status: 'active',
        isVerified: true,
        teamName: 'Mechanical Team'
      },
      {
        name: 'Lisa Electrical',
        email: 'lisa@gearguard.com',
        password: 'Aditya#17',
        role: 'technician',
        status: 'active',
        isVerified: true,
        teamName: 'Electrical Team'
      }
    ];
    
    // Delete existing test users
    const emails = testUsers.map(u => u.email);
    await User.deleteMany({ email: { $in: emails } });
    console.log('Deleted existing test users');
    
    // Create test users
    const createdUsers = await User.insertMany(testUsers);
    console.log('Test users created successfully:');
    
    createdUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createTestUsers();