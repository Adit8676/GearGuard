const mongoose = require('mongoose');
const Team = require('./src/models/team.model');
const Equipment = require('./src/models/equipment.model');
require('dotenv').config();

async function seedEquipmentData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create teams first
    const teams = [
      { name: "Mechanical Team", description: "Handles mechanical equipment maintenance" },
      { name: "Electrical Team", description: "Manages electrical systems and equipment" },
      { name: "IT Support Team", description: "Maintains IT infrastructure and equipment" },
      { name: "Facilities Team", description: "Manages building and facility equipment" }
    ];

    // Clear existing teams and equipment
    await Team.deleteMany({});
    await Equipment.deleteMany({});
    console.log('Cleared existing teams and equipment');

    // Insert teams
    const createdTeams = await Team.insertMany(teams);
    console.log('Teams created:', createdTeams.length);

    // Create equipment with team references
    const equipment = [
      {
        name: "CNC Machine 01",
        category: "Production",
        serialNumber: "CNC-8892",
        purchaseDate: new Date("2023-06-12"),
        warrantyTill: new Date("2026-06-12"),
        location: "Plant A",
        assignedTeamId: createdTeams[0]._id, // Mechanical Team
        status: "active"
      },
      {
        name: "Forklift FL-205",
        category: "Logistics",
        serialNumber: "FL-205-2024",
        purchaseDate: new Date("2024-01-15"),
        warrantyTill: new Date("2027-01-15"),
        location: "Warehouse B",
        assignedTeamId: createdTeams[0]._id, // Mechanical Team
        status: "active"
      },
      {
        name: "Server Rack SR-01",
        category: "IT Equipment",
        serialNumber: "SR-01-2023",
        purchaseDate: new Date("2023-03-20"),
        warrantyTill: new Date("2026-03-20"),
        location: "Data Center",
        assignedTeamId: createdTeams[2]._id, // IT Support Team
        status: "active"
      },
      {
        name: "Old Printer HP-2019",
        category: "Office Equipment",
        serialNumber: "HP-2019-OLD",
        purchaseDate: new Date("2019-05-10"),
        warrantyTill: new Date("2022-05-10"),
        location: "Office Floor 2",
        assignedTeamId: createdTeams[2]._id, // IT Support Team
        status: "scrapped"
      },
      {
        name: "HVAC Unit 01",
        category: "Facilities",
        serialNumber: "HVAC-2023-01",
        purchaseDate: new Date("2023-08-15"),
        warrantyTill: new Date("2028-08-15"),
        location: "Building A - Roof",
        assignedTeamId: createdTeams[3]._id, // Facilities Team
        status: "active"
      },
      {
        name: "Generator GEN-500",
        category: "Power Systems",
        serialNumber: "GEN-500-2022",
        purchaseDate: new Date("2022-11-20"),
        warrantyTill: new Date("2027-11-20"),
        location: "Power Room",
        assignedTeamId: createdTeams[1]._id, // Electrical Team
        status: "active"
      }
    ];

    // Insert equipment
    const createdEquipment = await Equipment.insertMany(equipment);
    console.log('Equipment created:', createdEquipment.length);

    console.log('\nSeed data created successfully:');
    console.log(`- ${createdTeams.length} teams`);
    console.log(`- ${createdEquipment.length} equipment items`);

  } catch (error) {
    console.error('Error seeding equipment data:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedEquipmentData();