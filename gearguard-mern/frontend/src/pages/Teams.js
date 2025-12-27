import React, { useState, useEffect } from 'react';
import { teamsAPI, usersAPI } from '../services/api';
import { toast } from 'react-toastify';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    members: [],
    color: '#3498db',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, usersRes] = await Promise.all([
        teamsAPI.getAll(),
        usersAPI.getTechnicians(),
      ]);

      setTeams(teamsRes.data.data);
      setUsers(usersRes.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load teams data');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTeam) {
        await teamsAPI.update(selectedTeam._id, formData);
        toast.success('Team updated successfully');
      } else {
        await teamsAPI.create(formData);
        toast.success('Team created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await teamsAPI.delete(id);
        toast.success('Team deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete team');
      }
    }
  };

  const handleEdit = (team) => {
    setSelectedTeam(team);
    setFormData({
      name: team.name,
      members: team.members.map(m => m._id),
      color: team.color || '#3498db',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      members: [],
      color: '#3498db',
    });
    setSelectedTeam(null);
  };

  const handleMemberToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }));
  };

  if (loading) {
    return <div className="loading">Loading teams...</div>;
  }

  return (
    <div className="equipment-list">
      <div className="equipment-header">
        <h1>Maintenance Teams</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          + Add Team
        </button>
      </div>

      <div className="equipment-grid">
        {teams.map((team) => (
          <div key={team._id} className="equipment-card">
            <h3 style={{ borderLeft: `4px solid ${team.color}`, paddingLeft: '10px' }}>
              {team.name}
            </h3>
            <div className="info">
              <strong>Members:</strong> {team.members?.length || 0}
            </div>
            <div className="info">
              {team.members?.map(member => (
                <div key={member._id} style={{ marginLeft: '10px', fontSize: '12px' }}>
                  • {member.name} ({member.role})
                </div>
              ))}
            </div>
            
            <div className="flex gap-10" style={{ marginTop: '15px' }}>
              <button className="btn btn-warning" onClick={() => handleEdit(team)}>
                ✏️ Edit
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(team._id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="form-modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedTeam ? 'Edit Team' : 'Add Team'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Team Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Color</label>
                <input
                  type="color"
                  className="form-control"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Team Members</label>
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: '10px' }}>
                  {users.map((user) => (
                    <div key={user._id} style={{ marginBottom: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.members.includes(user._id)}
                          onChange={() => handleMemberToggle(user._id)}
                          style={{ marginRight: '8px' }}
                        />
                        {user.name} ({user.role})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedTeam ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
