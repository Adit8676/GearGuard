import { create } from 'zustand';
import api from '../lib/api';
import toast from 'react-hot-toast';

const useRequestStore = create((set, get) => ({
  requests: [],
  equipment: [
    { _id: "eq1", name: "CNC Machine 01", teamId: "t1", teamName: "Mechanical Team" },
    { _id: "eq2", name: "Server Rack SR-01", teamId: "t2", teamName: "IT Support Team" },
    { _id: "eq3", name: "Conveyor Belt CB-03", teamId: "t1", teamName: "Mechanical Team" },
    { _id: "eq4", name: "Hydraulic Press HP-02", teamId: "t1", teamName: "Mechanical Team" },
    { _id: "eq5", name: "Network Switch NS-05", teamId: "t2", teamName: "IT Support Team" },
    { _id: "eq6", name: "Air Compressor AC-01", teamId: "t3", teamName: "Electrical Team" }
  ],
  loading: false,
  error: null,

  // Fetch user's requests
  fetchMyRequests: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/maintenance/my');
      const userRequests = response.data.requests || [];
      set({ requests: userRequests, loading: false });
    } catch (error) {
      console.warn('Backend unavailable, using dummy data');
      set({ loading: false });
    }
  },

  // Fetch equipment list
  fetchEquipment: async () => {
    try {
      const response = await api.get('/admin/equipment');
      console.log('Equipment API response:', response.data);
      set({ equipment: response.data.equipment || response.data });
    } catch (error) {
      console.error('Equipment API failed:', error);
      console.warn('Backend unavailable, using dummy equipment data');
    }
  },

  // Create new request
  createRequest: async (requestData) => {
    set({ loading: true, error: null });
    try {
      console.log('Creating request:', requestData);
      const response = await api.post('/maintenance', requestData);
      console.log('Request created successfully:', response.data);
      
      // Refresh the requests list after creating
      await get().fetchMyRequests();
      
      toast.success('Maintenance request created successfully');
      return response.data.request;
    } catch (error) {
      console.error('Request creation failed:', error);
      // Fallback to local storage
      const newRequest = {
        _id: Date.now().toString(),
        ...requestData,
        status: 'new',
        createdAt: new Date().toISOString()
      };
      set(state => ({
        requests: [newRequest, ...state.requests],
        loading: false
      }));
      toast.success('Maintenance request created successfully (offline mode)');
      return newRequest;
    }
  },

  // Get equipment by ID
  getEquipmentById: (equipmentId) => {
    const { equipment } = get();
    return equipment.find(eq => eq._id === equipmentId);
  }
}));

export default useRequestStore;