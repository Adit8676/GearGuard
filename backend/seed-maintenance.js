const mongoose = require('mongoose');
const MaintenanceRequest = require('./src/models/maintenanceRequest.model');
const Equipment = require('./src/models/equipment.model');
const Team = require('./src/models/team.model');
const User = require('./src/models/user.model');
require('dotenv').config();

async function seedMaintenanceRequests() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing maintenance requests
    await MaintenanceRequest.deleteMany({});
    console.log('Cleared existing maintenance requests');

    // Get existing data
    const equipment = await Equipment.find().populate('assignedTeamId');
    const users = await User.find();
    const admin = users.find(u => u.role === 'admin');

    if (!equipment.length || !admin) {
      console.log('No equipment or admin user found. Please seed equipment and users first.');
      return;
    }

    // Create sample maintenance requests
    const maintenanceRequests = [
      {
        subject: "Oil leak detected",
        description: "Machine is leaking oil from the main hydraulic system. Needs immediate attention.",
        type: "corrective",
        equipmentId: equipment[0]._id,
        equipmentName: equipment[0].name,
        teamId: equipment[0].assignedTeamId._id,
        teamName: equipment[0].assignedTeamId.name,
        status: "new",
        createdBy: admin._id
      },
      {
        subject: "Monthly preventive maintenance",
        description: "Routine monthly inspection and maintenance as per schedule.",
        type: "preventive",
        equipmentId: equipment[1] ? equipment[1]._id : equipment[0]._id,
        equipmentName: equipment[1] ? equipment[1].name : equipment[0].name,
        teamId: equipment[1] ? equipment[1].assignedTeamId._id : equipment[0].assignedTeamId._id,
        teamName: equipment[1] ? equipment[1].assignedTeamId.name : equipment[0].assignedTeamId.name,
        status: "in_progress",
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: 4,
        createdBy: admin._id
      },
      {
        subject: "Network connectivity issues",
        description: "Server rack experiencing intermittent network connectivity problems.",
        type: "corrective",
        equipmentId: equipment[2] ? equipment[2]._id : equipment[0]._id,
        equipmentName: equipment[2] ? equipment[2].name : equipment[0].name,
        teamId: equipment[2] ? equipment[2].assignedTeamId._id : equipment[0].assignedTeamId._id,
        teamName: equipment[2] ? equipment[2].assignedTeamId.name : equipment[0].assignedTeamId.name,
        status: "new",
        createdBy: admin._id
      },
      {
        subject: "Quarterly inspection completed",
        description: "Quarterly safety and performance inspection completed successfully.",
        type: "preventive",
        equipmentId: equipment[3] ? equipment[3]._id : equipment[0]._id,
        equipmentName: equipment[3] ? equipment[3].name : equipment[0].name,
        teamId: equipment[3] ? equipment[3].assignedTeamId._id : equipment[0].assignedTeamId._id,
        teamName: equipment[3] ? equipment[3].assignedTeamId.name : equipment[0].assignedTeamId.name,
        status: "repaired",
        scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        duration: 2,
        createdBy: admin._id
      }
    ];

    // Insert maintenance requests
    const createdRequests = await MaintenanceRequest.insertMany(maintenanceRequests);
    console.log('Maintenance requests created:', createdRequests.length);

    console.log('\nSeed data created successfully:');
    console.log(`- ${createdRequests.length} maintenance requests`);

  } catch (error) {
    console.error('Error seeding maintenance requests:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedMaintenanceRequests();