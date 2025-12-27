const mongoose = require('mongoose');
const Team = require('./src/models/team.model');
const User = require('./src/models/user.model');
require('dotenv').config();

async function seedTeams() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing teams
    await Team.deleteMany({});
    console.log('Cleared existing teams');

    // Get users
    const users = await User.find();
    const technicians = users.filter(u => u.role === 'technician');
    const managers = users.filter(u => u.role === 'manager');

    console.log('Found users:', {
      technicians: technicians.length,
      managers: managers.length
    });

    // Create teams with assigned members (ensure each has at least one technician)
    // Leave some users unassigned for testing team creation
    const teams = [
      {
        name: 'Mechanical Team',
        description: 'Handles mechanical equipment maintenance and repairs',
        members: technicians.length > 0 ? [technicians[0]._id] : []
      },
      {
        name: 'Electrical Team', 
        description: 'Manages electrical systems and equipment',
        members: technicians.length > 1 ? [technicians[1]._id] : []
      }
    ];

    // Filter out teams without technicians
    const validTeams = teams.filter(team => {
      if (team.members.length === 0) return false;
      // Check if team has at least one technician
      const teamTechnicians = team.members.filter(memberId => 
        technicians.some(tech => tech._id.toString() === memberId.toString())
      );
      return teamTechnicians.length > 0;
    });

    // Insert teams
    const createdTeams = await Team.insertMany(validTeams);
    console.log('Teams created:', createdTeams.length);

    // Show team assignments
    for (const team of createdTeams) {
      const populatedTeam = await Team.findById(team._id).populate('members', 'name email role');
      console.log(`\nTeam: ${populatedTeam.name}`);
      console.log(`Members: ${populatedTeam.members.length}`);
      populatedTeam.members.forEach(member => {
        console.log(`  - ${member.name} (${member.role})`);
      });
    }

  } catch (error) {
    console.error('Error seeding teams:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedTeams();