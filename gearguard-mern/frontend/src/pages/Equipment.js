import React, { useState, useEffect } from 'react';
import { equipmentAPI, categoriesAPI, teamsAPI, usersAPI, requestsAPI } from '../services/api';
import { toast } from 'react-toastify';

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    category: '',
    department: '',
    assignedEmployee: '',
    team: '',
    defaultTechnician: '',
    purchaseDate: '',
    warrantyStartDate: '',
    warrantyEndDate: '',
    warrantyInfo: '',
    location: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [equipRes, catRes, teamRes, userRes] = await Promise.all([
        equipmentAPI.getAll(),
        categoriesAPI.getAll(),
        teamsAPI.getAll(),
        usersAPI.getTechnicians(),
      ]);

      setEquipment(equipRes.data.data);
      setCategories(catRes.data.data);
      setTeams(teamRes.data.data);
      setUsers(userRes.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load equipment data');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedEquipment) {
        await equipmentAPI.update(selectedEquipment._id, formData);
        toast.success('Equipment updated successfully');
      } else {
        await equipmentAPI.create(formData);
        toast.success('Equipment created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await equipmentAPI.delete(id);
        toast.success('Equipment deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete equipment');
      }
    }
  };

  const handleEdit = (item) => {
    setSelectedEquipment(item);
    setFormData({
      name: item.name,
      serialNumber: item.serialNumber || '',
      category: item.category?._id || '',
      department: item.department || '',
      assignedEmployee: item.assignedEmployee?._id || '',
      team: item.team?._id || '',
      defaultTechnician: item.defaultTechnician?._id || '',
      purchaseDate: item.purchaseDate ? item.purchaseDate.split('T')[0] : '',
      warrantyStartDate: item.warrantyStartDate ? item.warrantyStartDate.split('T')[0] : '',
      warrantyEndDate: item.warrantyEndDate ? item.warrantyEndDate.split('T')[0] : '',
      warrantyInfo: item.warrantyInfo || '',
      location: item.location || '',
      notes: item.notes || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      serialNumber: '',
      category: '',
      department: '',
      assignedEmployee: '',
      team: '',
      defaultTechnician: '',
      purchaseDate: '',
      warrantyStartDate: '',
      warrantyEndDate: '',
      warrantyInfo: '',
      location: '',
      notes: '',
    });
    setSelectedEquipment(null);
  };

  const viewMaintenanceRequests = async (equipmentId) => {
    try {
      const response = await requestsAPI.getAll({ equipment: equipmentId });
      const requests = response.data.data;
      alert(`This equipment has ${requests.length} maintenance request(s)`);
      // You can replace this with a modal showing the requests
    } catch (error) {
      toast.error('Failed to load maintenance requests');
    }
  };

  if (loading) {
    return <div className="loading">Loading equipment...</div>;
  }

  return (
    <div className="equipment-list">
      <div className="equipment-header">
        <h1>Equipment Management</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          + Add Equipment
        </button>
      </div>

      <div className="equipment-grid">
        {equipment.map((item) => (
          <div key={item._id} className="equipment-card">
            <h3>{item.name}</h3>
            <div className="info"><strong>Serial:</strong> {item.serialNumber || 'N/A'}</div>
            <div className="info"><strong>Category:</strong> {item.category?.name}</div>
            <div className="info"><strong>Team:</strong> {item.team?.name}</div>
            <div className="info"><strong>Location:</strong> {item.location || 'N/A'}</div>
            <div className="info"><strong>Department:</strong> {item.department || 'N/A'}</div>
            
            <div className="flex gap-10" style={{ marginTop: '15px' }}>
              <button className="btn btn-primary" onClick={() => viewMaintenanceRequests(item._id)}>
                📋 Maintenance
              </button>
              <button className="btn btn-warning" onClick={() => handleEdit(item)}>
                ✏️ Edit
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>
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
              <h2>{selectedEquipment ? 'Edit Equipment' : 'Add Equipment'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Equipment Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Serial Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Maintenance Team *</label>
                <select
                  className="form-control"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  required
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>{team.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Default Technician</label>
                <select
                  className="form-control"
                  value={formData.defaultTechnician}
                  onChange={(e) => setFormData({ ...formData, defaultTechnician: e.target.value })}
                >
                  <option value="">Select Technician</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>{user.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Purchase Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedEquipment ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipment;
