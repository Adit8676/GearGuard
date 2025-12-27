const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Admin';

    if (!adminEmail || !adminPassword) {
      console.log('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      // Update password if different
      const isPasswordSame = await bcrypt.compare(adminPassword, existingAdmin.password);
      if (!isPasswordSame) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);
        existingAdmin.password = hashedPassword;
        await existingAdmin.save();
        console.log('Admin password updated successfully');
      } else {
        console.log('Admin user already exists with current password:', adminEmail);
      }
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });

    console.log('Admin user created successfully:');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedAdmin();