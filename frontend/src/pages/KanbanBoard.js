import React, { useState, useEffect } from 'react';
import { requestsAPI, equipmentAPI, teamsAPI, usersAPI } from '../services/api';
import { toast } from 'react-toastify';

const KanbanBoard = () => {
  const [requests, setRequests] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    subject: '',
    equipment: '',
    requestType: 'corrective',
    scheduledDate: new Date().toISOString().slice(0, 16),
    priority: 'normal',
    description: '',
  });

  const stages = [
    { id: 'new', name: 'New', color: '#17a2b8' },
    { id: 'in_progress', name: 'In Progress', color: '#ffc107' },
    { id: 'repaired', name: 'Repaired', color: '#28a745' },
    { id: 'scrap', name: 'Scrap', color: '#dc3545' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reqRes, equipRes, teamRes, userRes] = await Promise.all([
        requestsAPI.getAll(),
        equipmentAPI.getAll(),
        teamsAPI.getAll(),
        usersAPI.getTechnicians(),
      ]);

      setRequests(reqRes.data.data);
      setEquipment(equipRes.data.data);
      setTeams(teamRes.data.data);
      setUsers(userRes.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load kanban data');
      setLoading(false);
    }
  };

  const handleStageChange = async (requestId, newStage) => {
    try {
      const request = requests.find(r => r._id === requestId);
      await requestsAPI.update(requestId, { stage: newStage });
      
      if (newStage === 'scrap') {
        toast.warning(`Equipment "${request.equipment?.name}" marked as scrapped`);
      } else {
        toast.success('Request stage updated');
      }
      
      fetchData();
    } catch (error) {
      toast.error('Failed to update stage');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRequest) {
        await requestsAPI.update(selectedRequest._id, formData);
        toast.success('Request updated successfully');
      } else {
        await requestsAPI.create(formData);
        toast.success('Request created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setFormData({
      subject: request.subject,
      equipment: request.equipment?._id || '',
      requestType: request.requestType,
      scheduledDate: new Date(request.scheduledDate).toISOString().slice(0, 16),
      priority: request.priority,
      description: request.description || '',
      stage: request.stage,
      duration: request.duration || 0,
      assignedTechnician: request.assignedTechnician?._id || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      equipment: '',
      requestType: 'corrective',
      scheduledDate: new Date().toISOString().slice(0, 16),
      priority: 'normal',
      description: '',
    });
    setSelectedRequest(null);
  };

  const isOverdue = (scheduledDate, stage) => {
    if (stage === 'repaired' || stage === 'scrap') return false;
    return new Date(scheduledDate) < new Date();
  };

  if (loading) {
    return <div className="loading">Loading kanban board...</div>;
  }

  return (
    <div className="kanban-board">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Maintenance Kanban Board</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          + New Request
        </button>
      </div>

      <div className="kanban-columns">
        {stages.map((stage) => (
          <div key={stage.id} className="kanban-column">
            <h3 style={{ color: stage.color }}>
              {stage.name} ({requests.filter(r => r.stage === stage.id).length})
            </h3>
            
            <div>
              {requests
                .filter((request) => request.stage === stage.id)
                .map((request) => (
                  <div
                    key={request._id}
                    className={`kanban-card ${isOverdue(request.scheduledDate, request.stage) ? 'overdue' : ''}`}
                    onClick={() => handleEdit(request)}
                  >
                    <h4>{request.subject}</h4>
                    <div className="card-info">
                      📦 {request.equipment?.name}
                    </div>
                    <div className="card-info">
                      👤 {request.assignedTechnician?.name || 'Unassigned'}
                    </div>
                    <div className="card-info">
                      📅 {new Date(request.scheduledDate).toLocaleDateString()}
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <span className={`badge badge-${request.requestType}`}>
                        {request.requestType}
                      </span>
                      {isOverdue(request.scheduledDate, request.stage) && (
                        <span className="badge badge-overdue" style={{ marginLeft: '5px' }}>
                          Overdue
                        </span>
                      )}
                    </div>
                    
                    {/* Stage change buttons */}
                    <div className="flex gap-10" style={{ marginTop: '10px' }} onClick={(e) => e.stopPropagation()}>
                      {stage.id !== 'new' && (
                        <button
                          className="btn"
                          style={{ fontSize: '10px', padding: '4px 8px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const prevStageIndex = stages.findIndex(s => s.id === stage.id) - 1;
                            if (prevStageIndex >= 0) {
                              handleStageChange(request._id, stages[prevStageIndex].id);
                            }
                          }}
                        >
                          ←
                        </button>
                      )}
                      {stage.id !== 'scrap' && (
                        <button
                          className="btn"
                          style={{ fontSize: '10px', padding: '4px 8px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextStageIndex = stages.findIndex(s => s.id === stage.id) + 1;
                            if (nextStageIndex < stages.length) {
                              handleStageChange(request._id, stages[nextStageIndex].id);
                            }
                          }}
                        >
                          →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="form-modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedRequest ? 'Edit Request' : 'New Request'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Equipment *</label>
                <select
                  className="form-control"
                  value={formData.equipment}
                  onChange={async (e) => {
                    const equipmentId = e.target.value;
                    setFormData({ ...formData, equipment: equipmentId });
                    
                    // Auto-fill team and category from equipment
                    if (equipmentId) {
                      const selectedEquip = equipment.find(eq => eq._id === equipmentId);
                      if (selectedEquip) {
                        setFormData(prev => ({
                          ...prev,
                          equipment: equipmentId,
                          team: selectedEquip.team?._id || prev.team,
                          category: selectedEquip.category?._id || prev.category,
                          assignedTechnician: selectedEquip.defaultTechnician?._id || prev.assignedTechnician
                        }));
                        toast.info('Team and technician auto-filled from equipment');
                      }
                    }
                  }}
                  required
                >
                  <option value="">Select Equipment</option>
                  {equipment.map((item) => (
                    <option key={item._id} value={item._id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Request Type *</label>
                <select
                  className="form-control"
                  value={formData.requestType}
                  onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                >
                  <option value="corrective">Corrective (Breakdown)</option>
                  <option value="preventive">Preventive (Routine)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  className="form-control"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="very_high">Very High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Scheduled Date *</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  required
                />
              </div>

              {selectedRequest && (
                <>
                  <div className="form-group">
                    <label>Assigned Technician</label>
                    <select
                      className="form-control"
                      value={formData.assignedTechnician || ''}
                      onChange={(e) => setFormData({ ...formData, assignedTechnician: e.target.value })}
                    >
                      <option value="">Select Technician</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>{user.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Duration (Hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      className="form-control"
                      value={formData.duration || 0}
                      onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Stage</label>
                    <select
                      className="form-control"
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    >
                      {stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>{stage.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedRequest ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
