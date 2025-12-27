import React, { useState, useEffect } from 'react';
import { equipmentAPI, categoriesAPI, teamsAPI, usersAPI, requestsAPI } from '../services/api';
import { toast } from 'react-toastify';

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
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

  useEffect(() => {
    let filtered = equipment;
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterDepartment) {
      filtered = filtered.filter(item => item.department === filterDepartment);
    }
    setFilteredEquipment(filtered);
  }, [searchTerm, filterDepartment, equipment]);

  const fetchData = async () => {
    try {
      const [equipRes, catRes, teamRes, userRes] = await Promise.all([
        equipmentAPI.getAll(),
        categoriesAPI.getAll(),
        teamsAPI.getAll(),
        usersAPI.getTechnicians(),
      ]);

      const equipmentWithCounts = await Promise.all(
        equipRes.data.data.map(async (eq) => {
          try {
            const reqRes = await requestsAPI.getAll({ equipment: eq._id });
            const openRequests = reqRes.data.data.filter(r => r.stage !== 'repaired' && r.stage !== 'scrap');
            return { ...eq, maintenanceCount: openRequests.length };
          } catch {
            return { ...eq, maintenanceCount: 0 };
          }
        })
      );

      setEquipment(equipmentWithCounts);
      setFilteredEquipment(equipmentWithCounts);
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
      const cleanedData = { ...formData };
      if (!cleanedData.assignedEmployee) delete cleanedData.assignedEmployee;
      if (!cleanedData.defaultTechnician) delete cleanedData.defaultTechnician;
      
      if (selectedEquipment) {
        await equipmentAPI.update(selectedEquipment._id, cleanedData);
        toast.success('Equipment updated successfully');
      } else {
        await equipmentAPI.create(cleanedData);
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
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}
          />
          <select 
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            style={{padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}
          >
            <option value="">All Departments</option>
            {[...new Set(equipment.map(e => e.department).filter(Boolean))].map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            + Add Equipment
          </button>
        </div>
      </div>

      <div className="equipment-grid">
        {filteredEquipment.map((item) => (
          <div key={item._id} className="equipment-card">
            <h3>{item.name}</h3>
            <div className="info"><strong>Serial:</strong> {item.serialNumber || 'N/A'}</div>
            <div className="info"><strong>Category:</strong> {item.category?.name}</div>
            <div className="info"><strong>Team:</strong> {item.team?.name}</div>
            <div className="info"><strong>Location:</strong> {item.location || 'N/A'}</div>
            <div className="info"><strong>Department:</strong> {item.department || 'N/A'}</div>
            <div className="info"><strong>Status:</strong> <span style={{color: item.status === 'scrapped' ? 'red' : 'green'}}>{item.status}</span></div>
            
            <div className="flex gap-10" style={{ marginTop: '15px' }}>
              <button className="btn btn-primary" onClick={() => viewMaintenanceRequests(item._id)} style={{position: 'relative'}}>
                📋 Maintenance
                {item.maintenanceCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#dc3545',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.maintenanceCount}
                  </span>
                )}
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
