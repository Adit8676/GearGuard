const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const EquipmentCategory = require('./models/EquipmentCategory');
const MaintenanceTeam = require('./models/MaintenanceTeam');
const Equipment = require('./models/Equipment');
const MaintenanceRequest = require('./models/MaintenanceRequest');

// Sample data
const users = [
  { name: 'Admin User', email: 'admin@gearguard.com', password: 'admin123', role: 'admin' },
  { name: 'John Manager', email: 'manager@gearguard.com', password: 'manager123', role: 'manager', department: 'Production' },
  { name: 'Mike Technician', email: 'tech1@gearguard.com', password: 'tech123', role: 'technician' },
  { name: 'Sarah Technician', email: 'tech2@gearguard.com', password: 'tech123', role: 'technician' },
  { name: 'Bob IT Support', email: 'it@gearguard.com', password: 'itsupport123', role: 'technician', department: 'IT' },
];

const categories = [
  { name: 'CNC Machines', description: 'Computer numerical control machines' },
  { name: 'Vehicles', description: 'Company vehicles and transport' },
  { name: 'Computers', description: 'Desktop and laptop computers' },
  { name: 'Printers', description: 'Office printers and copiers' },
  { name: 'HVAC', description: 'Heating, ventilation, and air conditioning' },
];

// Database connection and seeding
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gearguard', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await EquipmentCategory.deleteMany({});
    await MaintenanceTeam.deleteMany({});
    await Equipment.deleteMany({});
    await MaintenanceRequest.deleteMany({});

    console.log('Cleared existing data...');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create categories
    const createdCategories = await EquipmentCategory.create(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // Create teams
    const teams = [
      {
        name: 'Mechanics Team',
        members: [createdUsers[2]._id, createdUsers[3]._id],
        color: '#3498db',
      },
      {
        name: 'IT Support Team',
        members: [createdUsers[4]._id],
        color: '#9b59b6',
      },
      {
        name: 'HVAC Team',
        members: [createdUsers[3]._id],
        color: '#e74c3c',
      },
    ];

    const createdTeams = await MaintenanceTeam.create(teams);
    console.log(`Created ${createdTeams.length} teams`);

    // Create equipment
    const equipment = [
      {
        name: 'CNC Machine 01',
        serialNumber: 'CNC-2023-001',
        category: createdCategories[0]._id,
        department: 'Production',
        team: createdTeams[0]._id,
        defaultTechnician: createdUsers[2]._id,
        location: 'Factory Floor - Section A',
        purchaseDate: new Date('2023-01-15'),
        warrantyEndDate: new Date('2025-01-15'),
      },
      {
        name: 'Forklift Truck',
        serialNumber: 'VEH-2022-045',
        category: createdCategories[1]._id,
        department: 'Warehouse',
        team: createdTeams[0]._id,
        defaultTechnician: createdUsers[3]._id,
        location: 'Warehouse - Loading Bay',
        purchaseDate: new Date('2022-06-10'),
      },
      {
        name: 'Office Laptop - Dell',
        serialNumber: 'DELL-2024-102',
        category: createdCategories[2]._id,
        assignedEmployee: createdUsers[1]._id,
        team: createdTeams[1]._id,
        defaultTechnician: createdUsers[4]._id,
        location: 'Office - 2nd Floor',
        purchaseDate: new Date('2024-01-20'),
        warrantyEndDate: new Date('2027-01-20'),
      },
      {
        name: 'HP LaserJet Printer',
        serialNumber: 'HP-PRN-2023-08',
        category: createdCategories[3]._id,
        department: 'Administration',
        team: createdTeams[1]._id,
        location: 'Office - Reception',
        purchaseDate: new Date('2023-08-05'),
      },
      {
        name: 'AC Unit - Main Hall',
        serialNumber: 'HVAC-2020-12',
        category: createdCategories[4]._id,
        team: createdTeams[2]._id,
        defaultTechnician: createdUsers[3]._id,
        location: 'Main Hall Ceiling',
        purchaseDate: new Date('2020-03-15'),
      },
    ];

    const createdEquipment = await Equipment.create(equipment);
    console.log(`Created ${createdEquipment.length} equipment`);

    // Create maintenance requests
    const requests = [
      {
        subject: 'Oil Leak Detected',
        equipment: createdEquipment[0]._id,
        category: createdCategories[0]._id,
        requestType: 'corrective',
        team: createdTeams[0]._id,
        assignedTechnician: createdUsers[2]._id,
        scheduledDate: new Date(),
        stage: 'new',
        priority: 'high',
        description: 'Machine is leaking oil from the hydraulic system',
      },
      {
        subject: 'Routine Preventive Maintenance',
        equipment: createdEquipment[1]._id,
        category: createdCategories[1]._id,
        requestType: 'preventive',
        team: createdTeams[0]._id,
        assignedTechnician: createdUsers[3]._id,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        stage: 'new',
        priority: 'normal',
        description: 'Scheduled oil change and inspection',
      },
      {
        subject: 'Laptop Not Booting',
        equipment: createdEquipment[2]._id,
        category: createdCategories[2]._id,
        requestType: 'corrective',
        team: createdTeams[1]._id,
        assignedTechnician: createdUsers[4]._id,
        scheduledDate: new Date(),
        stage: 'in_progress',
        priority: 'very_high',
        description: 'Laptop shows black screen on startup',
        duration: 1.5,
      },
      {
        subject: 'Printer Jam Issue',
        equipment: createdEquipment[3]._id,
        category: createdCategories[3]._id,
        requestType: 'corrective',
        team: createdTeams[1]._id,
        scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        stage: 'repaired',
        priority: 'low',
        description: 'Paper jam in tray 2',
        duration: 0.5,
        completedDate: new Date(),
      },
      {
        subject: 'AC Annual Service',
        equipment: createdEquipment[4]._id,
        category: createdCategories[4]._id,
        requestType: 'preventive',
        team: createdTeams[2]._id,
        assignedTechnician: createdUsers[3]._id,
        scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        stage: 'new',
        priority: 'normal',
        description: 'Annual cleaning and filter replacement',
      },
    ];

    const createdRequests = await MaintenanceRequest.create(requests);
    console.log(`Created ${createdRequests.length} maintenance requests`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Sample Login Credentials:');
    console.log('   Admin: admin@gearguard.com / admin123');
    console.log('   Manager: manager@gearguard.com / manager123');
    console.log('   Technician: tech1@gearguard.com / tech123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
