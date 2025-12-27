import { create } from 'zustand';
import api from '../lib/api';
import toast from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  
  // Temporary signup state for OTP flow
  signupData: null,
  setSignupData: (data) => set({ signupData: data }),
  clearSignupData: () => set({ signupData: null }),

  sendOtp: async (email) => {
    set({ isLoading: true });
    try {
      console.log('Sending OTP for email:', email);
      const response = await api.post('/auth/send-otp', { email });
      if (response.data.ok) {
        toast.success('OTP sent to your email');
        return response.data;
      }
    } catch (error) {
      console.log('Frontend OTP error:', error.response?.data);
      const message = error.response?.data?.message || 'Failed to send OTP';
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyOtp: async (otp) => {
    set({ isLoading: true });
    try {
      const signupData = get().signupData;
      if (!signupData) throw new Error('No signup data found');

      const response = await api.post('/auth/verify-otp', {
        ...signupData,
        otp
      });

      if (response.data.ok) {
        set({ user: response.data.user });
        get().clearSignupData();
        toast.success('Account created successfully!');
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid OTP';
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.ok) {
        set({ user: response.data.user });
        toast.success('Logged in successfully!');
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.ok) {
        set({ user: response.data.user });
      }
    } catch (error) {
      // Fallback to dummy user for demo
      const dummyUser = {
        _id: 'user1',
        name: 'John Technician',
        email: 'tech@gearguard.com',
        role: 'technician',
        teamId: 't1',
        teamName: 'Mechanical Team'
      };
      set({ user: dummyUser });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}));

export default useAuthStore;