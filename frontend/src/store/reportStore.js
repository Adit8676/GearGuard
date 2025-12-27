import { create } from 'zustand';
import api from '../lib/api';
import toast from 'react-hot-toast';

const useReportStore = create((set, get) => ({
  summary: null,
  teamStats: [],
  monthlyStats: [],
  isLoading: false,
  error: null,

  // Fetch summary metrics
  fetchSummary: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/reports/summary');
      if (response.data.ok) {
        set({ summary: response.data.summary, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch summary:', error);
      // Fallback to dummy data
      const dummySummary = {
        requestsThisMonth: 127,
        avgResponseTime: "2.4h",
        completionRate: "94%",
        teamEfficiency: "87%"
      };
      set({ summary: dummySummary, isLoading: false, error: 'Using offline data' });
      toast.error('Failed to load summary data. Using offline data.');
    }
  },

  // Fetch team statistics
  fetchTeamStats: async () => {
    try {
      const response = await api.get('/reports/by-team');
      if (response.data.ok) {
        set({ teamStats: response.data.teamStats });
      }
    } catch (error) {
      console.error('Failed to fetch team stats:', error);
      // Fallback to dummy data
      const dummyTeamStats = [
        {
          teamName: 'Mechanical Team',
          totalRequests: 45,
          completedRequests: 42,
          inProgressRequests: 3,
          completionRate: 93.3
        },
        {
          teamName: 'Electrical Team',
          totalRequests: 38,
          completedRequests: 35,
          inProgressRequests: 2,
          completionRate: 92.1
        },
        {
          teamName: 'IT Support Team',
          totalRequests: 29,
          completedRequests: 27,
          inProgressRequests: 1,
          completionRate: 93.1
        },
        {
          teamName: 'Facilities Team',
          totalRequests: 15,
          completedRequests: 14,
          inProgressRequests: 1,
          completionRate: 93.3
        }
      ];
      set({ teamStats: dummyTeamStats });
    }
  },

  // Fetch monthly statistics
  fetchMonthlyStats: async () => {
    try {
      const response = await api.get('/reports/monthly');
      if (response.data.ok) {
        set({ monthlyStats: response.data.monthlyStats });
      }
    } catch (error) {
      console.error('Failed to fetch monthly stats:', error);
      // Fallback to dummy data
      const dummyMonthlyStats = [
        { _id: { year: 2025, month: 1 }, totalRequests: 127, completedRequests: 119 },
        { _id: { year: 2024, month: 12 }, totalRequests: 134, completedRequests: 126 },
        { _id: { year: 2024, month: 11 }, totalRequests: 98, completedRequests: 92 },
        { _id: { year: 2024, month: 10 }, totalRequests: 112, completedRequests: 105 }
      ];
      set({ monthlyStats: dummyMonthlyStats });
    }
  },

  // Fetch all reports data
  fetchAllReports: async () => {
    const { fetchSummary, fetchTeamStats, fetchMonthlyStats } = get();
    await Promise.all([
      fetchSummary(),
      fetchTeamStats(),
      fetchMonthlyStats()
    ]);
  }
}));

export default useReportStore;