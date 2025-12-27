import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { requestsAPI } from '../services/api';
import { toast } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';

const CalendarView = () => {
  const [requests, setRequests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await requestsAPI.getAll({ requestType: 'preventive' });
      setRequests(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load calendar data');
      setLoading(false);
    }
  };

  const getRequestsForDate = (date) => {
    return requests.filter((request) => {
      const requestDate = new Date(request.scheduledDate);
      return (
        requestDate.getDate() === date.getDate() &&
        requestDate.getMonth() === date.getMonth() &&
        requestDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const tileContent = ({ date }) => {
    const dayRequests = getRequestsForDate(date);
    if (dayRequests.length > 0) {
      return (
        <div style={{ backgroundColor: '#e3f2fd', borderRadius: '50%', width: '6px', height: '6px', margin: '2px auto' }} />
      );
    }
    return null;
  };

  const selectedDateRequests = getRequestsForDate(selectedDate);

  if (loading) {
    return <div className="loading">Loading calendar...</div>;
  }

  return (
    <div className="calendar-container">
      <h1>Maintenance Calendar</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Showing preventive maintenance schedule
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
          />
        </div>

        <div className="card" style={{ height: 'fit-content' }}>
          <h3>
            Events on {selectedDate.toLocaleDateString()}
          </h3>
          
          {selectedDateRequests.length === 0 ? (
            <p style={{ color: '#666', marginTop: '10px' }}>No maintenance scheduled for this day</p>
          ) : (
            <div>
              {selectedDateRequests.map((request) => (
                <div key={request._id} style={{ 
                  padding: '12px', 
                  borderLeft: '3px solid #007bff', 
                  marginTop: '10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px'
                }}>
                  <h4 style={{ margin: '0 0 8px 0' }}>{request.subject}</h4>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    <div>📦 {request.equipment?.name}</div>
                    <div>👤 {request.assignedTechnician?.name || 'Unassigned'}</div>
                    <div>🕐 {new Date(request.scheduledDate).toLocaleTimeString()}</div>
                    <div style={{ marginTop: '8px' }}>
                      <span className={`badge badge-${request.stage.replace('_', '-')}`}>
                        {request.stage.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h3>Upcoming Preventive Maintenance</h3>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Equipment</th>
              <th>Team</th>
              <th>Technician</th>
              <th>Scheduled Date</th>
              <th>Stage</th>
            </tr>
          </thead>
          <tbody>
            {requests
              .filter(r => new Date(r.scheduledDate) >= new Date())
              .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
              .slice(0, 10)
              .map((request) => (
                <tr key={request._id}>
                  <td>{request.subject}</td>
                  <td>{request.equipment?.name}</td>
                  <td>{request.team?.name}</td>
                  <td>{request.assignedTechnician?.name || 'Unassigned'}</td>
                  <td>{new Date(request.scheduledDate).toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${request.stage.replace('_', '-')}`}>
                      {request.stage.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarView;
