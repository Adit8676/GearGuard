import { create } from 'zustand';
import api from '../lib/api';
import toast from 'react-hot-toast';

const useAdminStore = create((set, get) => ({
  // Users data (will be fetched from API)
  users: [],
  
  // Teams data (will be fetched from API)
  teams: [],
  
  // Unassigned users
  unassignedUsers: [],

  // Equipment data
  equipment: [
    {
      id: 1,
      name: "CNC Machine 01",
      category: "Production",
      serialNumber: "CNC-8892",
      purchaseDate: "2023-06-12",
      warrantyTill: "2026-06-12",
      location: "Plant A",
      assignedTeamId: 1,
      assignedTeamName: "Mechanical Team",
      status: "active",
      createdAt: "2025-12-27"
    },
    {
      id: 2,
      name: "Forklift FL-205",
      category: "Logistics",
      serialNumber: "FL-205-2024",
      purchaseDate: "2024-01-15",
      warrantyTill: "2027-01-15",
      location: "Warehouse B",
      assignedTeamId: 1,
      assignedTeamName: "Mechanical Team",
      status: "active",
      createdAt: "2025-12-27"
    },
    {
      id: 3,
      name: "Server Rack SR-01",
      category: "IT Equipment",
      serialNumber: "SR-01-2023",
      purchaseDate: "2023-03-20",
      warrantyTill: "2026-03-20",
      location: "Data Center",
      assignedTeamId: 3,
      assignedTeamName: "IT Support Team",
      status: "active",
      createdAt: "2025-12-27"
    },
    {
      id: 4,
      name: "Old Printer HP-2019",
      category: "Office Equipment",
      serialNumber: "HP-2019-OLD",
      purchaseDate: "2019-05-10",
      warrantyTill: "2022-05-10",
      location: "Office Floor 2",
      assignedTeamId: 3,
      assignedTeamName: "IT Support Team",
      status: "scrapped",
      createdAt: "2025-12-27"
    },
    {
      id: 5,
      name: "Hp Printer",
      category: "IT",
      serialNumber: "IS-2011",
      purchaseDate: "2025-12-18",
      warrantyTill: "2027-12-18",
      location: "Plant A",
      assignedTeamId: 3,
      assignedTeamName: "IT Support Team",
      status: "active",
      createdAt: "2025-12-27"
    }
  ],

  // User management actions
  fetchUsers: async () => {
    try {
      const response = await api.get('/users');
      if (response.data.ok) {
        set({ users: response.data.users });
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      set({ users: [] });
    }
  },

  upgradeUserRole: async (userId, newRole) => {
    try {
      const response = await api.put(`/users/${userId}/upgrade-role`, { role: newRole });
      if (response.data.ok) {
        set(state => ({
          users: state.users.map(user => 
            user._id === userId ? response.data.user : user
          )
        }));
        toast.success(`User role upgraded to ${newRole} successfully!`);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upgrade user role';
      toast.error(message);
    }
  },

  disableUser: async (userId) => {
    try {
      const response = await api.put(`/users/${userId}/disable`);
      if (response.data.ok) {
        set(state => ({
          users: state.users.map(user => 
            user._id === userId ? response.data.user : user
          )
        }));
        toast.success('User disabled successfully!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to disable user';
      toast.error(message);
    }
  },

  enableUser: async (userId) => {
    try {
      const response = await api.put(`/users/${userId}/enable`);
      if (response.data.ok) {
        set(state => ({
          users: state.users.map(user => 
            user._id === userId ? response.data.user : user
          )
        }));
        toast.success('User enabled successfully!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to enable user';
      toast.error(message);
    }
  },

  // API functions
  fetchTeams: async () => {
    try {
      const response = await api.get('/teams');
      if (response.data.ok) {
        set({ teams: response.data.teams });
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      // Fallback to empty array if API fails
      set({ teams: [] });
    }
  },

  fetchUnassignedUsers: async () => {
    try {
      const response = await api.get('/teams/unassigned-users');
      if (response.data.ok) {
        set({ unassignedUsers: response.data.unassignedUsers });
      }
    } catch (error) {
      console.error('Failed to fetch unassigned users:', error);
      // Fallback to empty array if API fails
      set({ unassignedUsers: [] });
    }
  },

  createTeam: async (teamData) => {
    try {
      const response = await api.post('/teams', teamData);
      if (response.data.ok) {
        set(state => ({ teams: [...state.teams, response.data.team] }));
        toast.success('Team created successfully!');
        return response.data.team;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create team';
      toast.error(message);
      throw error;
    }
  },

  addMemberToTeam: async (teamId, userId) => {
    try {
      const response = await api.post(`/teams/${teamId}/members`, { userId });
      if (response.data.ok) {
        set(state => ({
          teams: state.teams.map(team => 
            team._id === teamId ? response.data.team : team
          ),
          unassignedUsers: state.unassignedUsers.filter(user => user._id !== userId)
        }));
        toast.success('Member added to team successfully!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add member';
      toast.error(message);
    }
  },

  removeMemberFromTeam: async (teamId, userId) => {
    try {
      const response = await api.delete(`/teams/${teamId}/members/${userId}`);
      if (response.data.ok) {
        set(state => ({
          teams: state.teams.map(team => 
            team._id === teamId ? response.data.team : team
          )
        }));
        // Refresh unassigned users
        get().fetchUnassignedUsers();
        toast.success('Member removed from team');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove member';
      toast.error(message);
    }
  },

  // Team management actions (legacy - keeping for compatibility)
  addTeam: (teamData) => {
    const newTeam = {
      ...teamData,
      id: Date.now(),
      members: []
    };
    
    set(state => ({ teams: [...state.teams, newTeam] }));
    toast.success('Team added successfully!');
  },

  assignUserToTeam: (teamId, userId) => {
    const { teams, users } = get();
    const user = users.find(u => u.id === userId);
    
    if (!user) return;
    
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        const isAlreadyMember = team.members.some(member => member.id === userId);
        if (!isAlreadyMember) {
          return {
            ...team,
            members: [...team.members, { id: user.id, name: user.name, role: user.role }]
          };
        }
      }
      return team;
    });
    
    set({ teams: updatedTeams });
    toast.success(`${user.name} assigned to team successfully!`);
  },

  removeUserFromTeam: (teamId, userId) => {
    const { teams } = get();
    
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: team.members.filter(member => member.id !== userId)
        };
      }
      return team;
    });
    
    set({ teams: updatedTeams });
    toast.success('Member removed from team');
  },

  // Equipment actions
  addEquipment: (equipmentData) => {
    const { teams, equipment } = get();
    const assignedTeam = teams.find(team => team.id === equipmentData.assignedTeamId);
    
    const newEquipment = {
      ...equipmentData,
      id: Date.now(),
      assignedTeamName: assignedTeam?.name || '',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    set({ equipment: [...equipment, newEquipment] });
    toast.success('Equipment added successfully!');
  },

  markAsScrap: (equipmentId) => {
    const { equipment } = get();
    const updatedEquipment = equipment.map(item =>
      item.id === equipmentId ? { ...item, status: 'scrapped' } : item
    );
    
    set({ equipment: updatedEquipment });
    toast.success('Equipment marked as scrapped');
  },

  // Filters and search
  searchTerm: '',
  categoryFilter: '',
  teamFilter: '',
  statusFilter: '',

  setSearchTerm: (term) => set({ searchTerm: term }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setTeamFilter: (teamId) => set({ teamFilter: teamId }),
  setStatusFilter: (status) => set({ statusFilter: status }),

  // Filtered equipment getter
  getFilteredEquipment: () => {
    const { equipment, searchTerm, categoryFilter, teamFilter, statusFilter } = get();
    
    return equipment.filter(item => {
      const matchesSearch = !searchTerm || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !categoryFilter || item.category === categoryFilter;
      const matchesTeam = !teamFilter || item.assignedTeamId.toString() === teamFilter;
      const matchesStatus = !statusFilter || item.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesTeam && matchesStatus;
    });
  }
}));

export default useAdminStore;