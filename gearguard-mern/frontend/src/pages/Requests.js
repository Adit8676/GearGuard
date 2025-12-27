import React, { useState, useEffect } from 'react';
import { requestsAPI, equipmentAPI } from '../services/api';
import { toast } from 'react-toastify';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await requestsAPI.getAll();
      setRequests(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load requests');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStageColor = (stage) => {
    const colors = {
      new: '#17a2b8',
      in_progress: '#ffc107',
      repaired: '#28a745',
      scrap: '#dc3545',
    };
    return colors[stage] || '#6c757d';
  };

  if (loading) {
    return <div className="loading">Loading requests...</div>;
  }

  return (
    <div className="card">
      <h1>Maintenance Requests</h1>
      
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Equipment</th>
              <th>Type</th>
              <th>Team</th>
              <th>Technician</th>
              <th>Stage</th>
              <th>Priority</th>
              <th>Scheduled Date</th>
              <th>Duration (hrs)</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.subject}</td>
                <td>{request.equipment?.name}</td>
                <td>
                  <span className={`badge badge-${request.requestType}`}>
                    {request.requestType}
                  </span>
                </td>
                <td>{request.team?.name}</td>
                <td>{request.assignedTechnician?.name || 'Unassigned'}</td>
                <td>
                  <span 
                    className="badge" 
                    style={{ backgroundColor: getStageColor(request.stage), color: 'white' }}
                  >
                    {request.stage.replace('_', ' ')}
                  </span>
                </td>
                <td>{request.priority}</td>
                <td>{formatDate(request.scheduledDate)}</td>
                <td>{request.duration || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Requests;
