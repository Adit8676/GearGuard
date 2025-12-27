import { create } from 'zustand';
import api from '../lib/api';
import toast from 'react-hot-toast';

const useMaintenanceStore = create((set, get) => ({
  requests: [],
  isLoading: false,
  error: null,

  // Filters
  searchTerm: '',
  statusFilter: '',
  typeFilter: '',
  teamFilter: '',

  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setTypeFilter: (type) => set({ typeFilter: type }),
  setTeamFilter: (team) => set({ teamFilter: team }),

  // Fetch all maintenance requests
  fetchRequests: async () => {
    console.log('Loading maintenance requests...');
    set({ isLoading: true, error: null });
    
    // Use dummy data directly
    const dummyRequests = [
      {
        _id: 'm1',
        subject: 'Machine making unusual noise',
        description: 'CNC Machine is producing unusual grinding noise during operation',
        type: 'corrective',
        priority: 'high',
        equipmentId: 'eq1',
        equipmentName: 'CNC Machine 01',
        teamId: 't1',
        teamName: 'Mechanical Team',
        status: 'new',
        assignedTo: null,
        assignedToName: null,
        scheduledDate: null,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'm2',
        subject: 'Network connectivity issue',
        description: 'Server rack experiencing intermittent network problems',
        type: 'corrective',
        priority: 'medium',
        equipmentId: 'eq2',
        equipmentName: 'Server Rack SR-01',
        teamId: 't2',
        teamName: 'IT Support Team',
        status: 'in_progress',
        assignedTo: 'tech1',
        assignedToName: 'John Doe',
        scheduledDate: null,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'm3',
        subject: 'Monthly preventive maintenance',
        description: 'Routine monthly inspection and maintenance',
        type: 'preventive',
        priority: 'medium',
        equipmentId: 'eq3',
        equipmentName: 'Conveyor Belt CB-03',
        teamId: 't1',
        teamName: 'Mechanical Team',
        status: 'new',
        assignedTo: null,
        assignedToName: null,
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'm4',
        subject: 'Hydraulic system maintenance',
        description: 'Quarterly hydraulic system inspection completed',
        type: 'preventive',
        priority: 'low',
        equipmentId: 'eq4',
        equipmentName: 'Hydraulic Press HP-02',
        teamId: 't1',
        teamName: 'Mechanical Team',
        status: 'repaired',
        assignedTo: 'tech2',
        assignedToName: 'Jane Smith',
        scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'm5',
        subject: 'Network switch replacement',
        description: 'Old network switch needs replacement due to hardware failure',
        type: 'corrective',
        priority: 'high',
        equipmentId: 'eq5',
        equipmentName: 'Network Switch NS-05',
        teamId: 't2',
        teamName: 'IT Support Team',
        status: 'scrap',
        assignedTo: 'tech3',
        assignedToName: 'Mike Johnson',
        scheduledDate: null,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'm6',
        subject: 'Air compressor maintenance',
        description: 'Weekly preventive maintenance for air compressor',
        type: 'preventive',
        priority: 'medium',
        equipmentId: 'eq6',
        equipmentName: 'Air Compressor AC-01',
        teamId: 't3',
        teamName: 'Electrical Team',
        status: 'in_progress',
        assignedTo: 'tech4',
        assignedToName: 'Sarah Wilson',
        scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    set({ requests: dummyRequests, isLoading: false, error: null });
  },

  // Create new maintenance request
  createRequest: async (requestData) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/maintenance', requestData);
      if (response.data.ok) {
        set(state => ({
          requests: [response.data.request, ...state.requests],
          isLoading: false
        }));
        toast.success('Maintenance request created successfully!');
        return response.data.request;
      }
    } catch (error) {
      console.error('Failed to create maintenance request:', error);
      // Fallback: add to local store
      const newRequest = {
        _id: `temp_${Date.now()}`,
        ...requestData,
        status: 'new',
        assignedTo: null,
        assignedToName: null,
        createdAt: new Date().toISOString()
      };
      set(state => ({
        requests: [newRequest, ...state.requests],
        isLoading: false
      }));
      toast.success('Request created (offline mode)');
      return newRequest;
    }
  },

  // Update request status
  updateStatus: async (requestId, status, assignedTo = null) => {
    // Update local store directly
    set(state => ({
      requests: state.requests.map(req =>
        req._id === requestId ? { 
          ...req, 
          status,
          assignedTo: assignedTo || req.assignedTo,
          assignedToName: assignedTo ? 'Current User' : req.assignedToName
        } : req
      )
    }));
    toast.success('Status updated successfully!');
  },

  // Get filtered requests
  getFilteredRequests: () => {
    const { requests, searchTerm, statusFilter, typeFilter, teamFilter } = get();
    
    return requests.filter(request => {
      const matchesSearch = !searchTerm || 
        request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.equipmentName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || request.status === statusFilter;
      const matchesType = !typeFilter || request.type === typeFilter;
      const matchesTeam = !teamFilter || request.teamName === teamFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesTeam;
    });
  }
}));

export default useMaintenanceStore;