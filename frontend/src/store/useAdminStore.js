import { create } from 'zustand';
import toast from 'react-hot-toast';

const useAdminStore = create((set, get) => ({
  users: [
    {
      id: 1,
      name: "System Admin",
      email: "admin@gearguard.com",
      role: "admin",
      status: "active",
      teamId: null,
      managedTeams: [],
      createdAt: "2025-01-01"
    },
    {
      id: 2,
      name: "Aditya Singh",
      email: "aditya.singh@gmail.com",
      role: "user",
      status: "active",
      teamId: null,
      managedTeams: [],
      createdAt: "2025-01-02"
    },
    {
      id: 3,
      name: "John Doe",
      email: "john.doe@gmail.com",
      role: "technician",
      status: "active",
      teamId: 1,
      managedTeams: [],
      createdAt: "2025-01-03"
    },
    {
      id: 4,
      name: "Jane Smith",
      email: "jane.smith@gmail.com",
      role: "technician",
      status: "active",
      teamId: 1,
      managedTeams: [],
      createdAt: "2025-01-04"
    },
    {
      id: 5,
      name: "Mike Manager",
      email: "mike.manager@gmail.com",
      role: "manager",
      status: "active",
      teamId: null,
      managedTeams: [1],
      createdAt: "2025-01-05"
    },
    {
      id: 6,
      name: "Sarah Wilson",
      email: "sarah.wilson@gmail.com",
      role: "user",
      status: "active",
      teamId: null,
      managedTeams: [],
      createdAt: "2025-01-06"
    },
    {
      id: 7,
      name: "Robert Johnson",
      email: "robert.johnson@gmail.com",
      role: "technician",
      status: "disabled",
      teamId: 2,
      managedTeams: [],
      createdAt: "2025-01-07"
    },
    {
      id: 8,
      name: "Emily Davis",
      email: "emily.davis@gmail.com",
      role: "user",
      status: "disabled",
      teamId: null,
      managedTeams: [],
      createdAt: "2025-01-08"
    },
    {
      id: 9,
      name: "David Brown",
      email: "david.brown@gmail.com",
      role: "technician",
      status: "active",
      teamId: 2,
      managedTeams: [],
      createdAt: "2025-01-09"
    },
    {
      id: 10,
      name: "Lisa Anderson",
      email: "lisa.anderson@gmail.com",
      role: "manager",
      status: "active",
      teamId: null,
      managedTeams: [2],
      createdAt: "2025-01-10"
    },
    {
      id: 11,
      name: "Mark Taylor",
      email: "mark.taylor@gmail.com",
      role: "user",
      status: "active",
      teamId: null,
      managedTeams: [],
      createdAt: "2025-01-11"
    },
    {
      id: 12,
      name: "Jennifer White",
      email: "jennifer.white@gmail.com",
      role: "technician",
      status: "active",
      teamId: null,
      managedTeams: [],
      createdAt: "2025-01-12"
    },
    {
      id: 13,
      name: "Kevin Martinez",
      email: "kevin.martinez@gmail.com",
      role: "user",
      status: "disabled",
      teamId: null,
      managedTeams: [],
      createdAt: "2025-01-13"
    },
    {
      id: 14,
      name: "Amanda Garcia",
      email: "amanda.garcia@gmail.com",
      role: "manager",
      status: "disabled",
      teamId: null,
      managedTeams: [],
      createdAt: "2025-01-14"
    },
    {
      id: 15,
      name: "Chris Wilson",
      email: "chris.wilson@gmail.com",
      role: "technician",
      status: "active",
      teamId: null,
      managedTeams: [],
      createdAt: "2025-01-15"
    },
    {
      id: 16,
      name: "Michelle Lee",
      email: "michelle.lee@gmail.com",
      role: "user",
      status: "active",
      teamId: null,
      managedTeams: [],
      createdAt: "2025-01-16"
    },
    {
      id: 17,
      name: "Ryan Thompson",
      email: "ryan.thompson@gmail.com",
      role: "technician",
      status: "disabled",
      teamId: null,
      managedTeams: [],
      createdAt: "2025-01-17"
    },
    {
      id: 18,
      name: "Nicole Rodriguez",
      email: "nicole.rodriguez@gmail.com",
      role: "user",
      status: "active",
      teamId: null,
      managedTeams: [],
      createdAt: "2025-01-18"
    },
    {
      id: 19,
      name: "Jason Miller",
      email: "jason.miller@gmail.com",
      role: "manager",
      status: "active",
      teamId: null,
      managedTeams: [],
      createdAt: "2025-01-19"
    },
    {
      id: 20,
      name: "Stephanie Clark",
      email: "stephanie.clark@gmail.com",
      role: "technician",
      status: "active",
      teamId: null,
      managedTeams: [],
      createdAt: "2025-01-20"
    }
  ],
  teams: [
    {
      id: 1,
      name: "Electrical Team",
      description: "Handles electrical equipment maintenance",
      technicians: [3, 4],
      managers: [5],
      createdAt: "2025-01-10"
    },
    {
      id: 2,
      name: "Mechanical Team",
      description: "Handles mechanical equipment maintenance",
      technicians: [7, 9],
      managers: [10],
      createdAt: "2025-01-15"
    }
  ],
  isLoading: false,

  // User Management Actions
  updateUserStatus: (userId, status) => {
    set(state => ({
      users: state.users.map(user => 
        user.id === userId ? { ...user, status } : user
      )
    }));
    toast.success(`User ${status === 'active' ? 'enabled' : 'disabled'}`);
  },

  assignManager: (userId, teamIds) => {
    set(state => ({
      users: state.users.map(user => 
        user.id === userId 
          ? { ...user, role: 'manager', managedTeams: teamIds }
          : user
      )
    }));
    toast.success('Manager role assigned successfully');
  },

  // Team Management Actions
  createTeam: (teamData) => {
    const { name, description, technicianIds } = teamData;
    const state = get();
    
    // Check if team name already exists
    if (state.teams.some(team => team.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Team name already exists');
      return false;
    }

    const newTeam = {
      id: Math.max(...state.teams.map(t => t.id), 0) + 1,
      name,
      description,
      technicians: technicianIds,
      managers: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Update users to technician role and assign team
    set(state => ({
      teams: [...state.teams, newTeam],
      users: state.users.map(user => 
        technicianIds.includes(user.id)
          ? { ...user, role: 'technician', teamId: newTeam.id }
          : user
      )
    }));
    
    toast.success('Team created successfully');
    return true;
  },

  addTechnicianToTeam: (teamId, userId) => {
    set(state => ({
      teams: state.teams.map(team => 
        team.id === teamId 
          ? { ...team, technicians: [...team.technicians, userId] }
          : team
      ),
      users: state.users.map(user => 
        user.id === userId 
          ? { ...user, role: 'technician', teamId }
          : user
      )
    }));
    toast.success('Technician added to team');
  },

  removeTechnicianFromTeam: (teamId, userId) => {
    const state = get();
    const team = state.teams.find(t => t.id === teamId);
    
    if (team && team.technicians.length <= 1) {
      toast.error('Cannot remove the last technician from team');
      return;
    }

    set(state => ({
      teams: state.teams.map(team => 
        team.id === teamId 
          ? { ...team, technicians: team.technicians.filter(id => id !== userId) }
          : team
      ),
      users: state.users.map(user => 
        user.id === userId 
          ? { ...user, teamId: null }
          : user
      )
    }));
    toast.success('Technician removed from team');
  },

  assignManagerToTeam: (teamId, managerIds) => {
    set(state => ({
      teams: state.teams.map(team => 
        team.id === teamId 
          ? { ...team, managers: managerIds }
          : team
      ),
      users: state.users.map(user => 
        managerIds.includes(user.id)
          ? { ...user, managedTeams: [...new Set([...user.managedTeams, teamId])] }
          : user.managedTeams.includes(teamId)
          ? { ...user, managedTeams: user.managedTeams.filter(id => id !== teamId) }
          : user
      )
    }));
    toast.success('Managers assigned to team');
  },

  // Helper functions
  getAvailableTechnicians: () => {
    const state = get();
    return state.users.filter(user => 
      (user.role === 'user') || 
      (user.role === 'technician' && user.teamId === null)
    );
  },

  getManagers: () => {
    const state = get();
    return state.users.filter(user => user.role === 'manager');
  },

  getTeamTechnicians: (teamId) => {
    const state = get();
    const team = state.teams.find(t => t.id === teamId);
    if (!team) return [];
    return state.users.filter(user => team.technicians.includes(user.id));
  },

  getTeamManagers: (teamId) => {
    const state = get();
    const team = state.teams.find(t => t.id === teamId);
    if (!team) return [];
    return state.users.filter(user => team.managers.includes(user.id));
  }
}));

export default useAdminStore;