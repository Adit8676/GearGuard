const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
require('dotenv').config();

const users = [
  { name: process.env.ADMIN_NAME, email: process.env.ADMIN_EMAIL, role: "admin", status: "active" },
  { name: "Aditya Singh", email: "aditya.singh@gmail.com", role: "user", status: "active" },
  { name: "John Doe", email: "john.doe@gmail.com", role: "technician", status: "active" },
  { name: "Jane Smith", email: "jane.smith@gmail.com", role: "technician", status: "active" },
  { name: "Mike Manager", email: "mike.manager@gmail.com", role: "manager", status: "active" },
  { name: "Sarah Wilson", email: "sarah.wilson@gmail.com", role: "user", status: "active" },
  { name: "Robert Johnson", email: "robert.johnson@gmail.com", role: "technician", status: "disabled" },
  { name: "Emily Davis", email: "emily.davis@gmail.com", role: "user", status: "disabled" },
  { name: "David Brown", email: "david.brown@gmail.com", role: "technician", status: "active" },
  { name: "Lisa Anderson", email: "lisa.anderson@gmail.com", role: "manager", status: "active" },
  { name: "Mark Taylor", email: "mark.taylor@gmail.com", role: "user", status: "active" },
  { name: "Jennifer White", email: "jennifer.white@gmail.com", role: "technician", status: "active" },
  { name: "Kevin Martinez", email: "kevin.martinez@gmail.com", role: "user", status: "disabled" },
  { name: "Amanda Garcia", email: "amanda.garcia@gmail.com", role: "manager", status: "disabled" },
  { name: "Chris Wilson", email: "chris.wilson@gmail.com", role: "technician", status: "active" },
  { name: "Michelle Lee", email: "michelle.lee@gmail.com", role: "user", status: "active" },
  { name: "Ryan Thompson", email: "ryan.thompson@gmail.com", role: "technician", status: "disabled" },
  { name: "Nicole Rodriguez", email: "nicole.rodriguez@gmail.com", role: "user", status: "active" },
  { name: "Jason Miller", email: "jason.miller@gmail.com", role: "manager", status: "active" },
  { name: "Stephanie Clark", email: "stephanie.clark@gmail.com", role: "technician", status: "active" }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    console.log('Cleared existing users');

    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const defaultPassword = await bcrypt.hash('Aditya#17', 10);
    
    const usersWithPassword = users.map(user => ({
      ...user,
      password: user.role === 'admin' ? adminPassword : defaultPassword,
      isVerified: true
    }));

    await User.insertMany(usersWithPassword);
    console.log('Seeded 20 users successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();