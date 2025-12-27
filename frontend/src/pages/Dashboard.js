import React, { useState, useEffect } from 'react';
import { requestsAPI, equipmentAPI } from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    newRequests: 0,
    inProgress: 0,
    completed: 0,
    totalEquipment: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [requestsRes, equipmentRes, statsRes] = await Promise.all([
        requestsAPI.getAll(),
        equipmentAPI.getAll(),
        requestsAPI.getStats(),
      ]);

      const requests = requestsRes.data.data;
      const equipment = equipmentRes.data.data;

      setStats({
        totalRequests: requests.length,
        newRequests: requests.filter(r => r.stage === 'new').length,
        inProgress: requests.filter(r => r.stage === 'in_progress').length,
        completed: requests.filter(r => r.stage === 'repaired').length,
        totalEquipment: equipment.length,
      });

      setRecentRequests(requests.slice(0, 5));
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Equipment</h3>
          <div className="stat-value">{stats.totalEquipment}</div>
        </div>
        <div className="stat-card">
          <h3>Total Requests</h3>
          <div className="stat-value">{stats.totalRequests}</div>
        </div>
        <div className="stat-card">
          <h3>New Requests</h3>
          <div className="stat-value">{stats.newRequests}</div>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <div className="stat-value">{stats.inProgress}</div>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <div className="stat-value">{stats.completed}</div>
        </div>
      </div>

      <div className="card">
        <h2>Recent Maintenance Requests</h2>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Equipment</th>
              <th>Type</th>
              <th>Stage</th>
              <th>Scheduled Date</th>
            </tr>
          </thead>
          <tbody>
            {recentRequests.map((request) => (
              <tr key={request._id}>
                <td>{request.subject}</td>
                <td>{request.equipment?.name}</td>
                <td>
                  <span className={`badge badge-${request.requestType}`}>
                    {request.requestType}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${request.stage.replace('_', '-')}`}>
                    {request.stage.replace('_', ' ')}
                  </span>
                </td>
                <td>{new Date(request.scheduledDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
