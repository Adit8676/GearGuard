import { useState } from 'react';
import { Search, Plus, Eye, AlertTriangle, Package, Filter } from 'lucide-react';
import useAdminStore from '../../store/adminStore';
import usePageTitle from '../../hooks/usePageTitle';

const Equipment = () => {
  usePageTitle('Equipment Management');
  
  const {
    teams,
    searchTerm,
    categoryFilter,
    teamFilter,
    statusFilter,
    setSearchTerm,
    setCategoryFilter,
    setTeamFilter,
    setStatusFilter,
    getFilteredEquipment,
    addEquipment,
    markAsScrap
  } = useAdminStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showScrapModal, setShowScrapModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    serialNumber: '',
    purchaseDate: '',
    warrantyTill: '',
    location: '',
    assignedTeamId: ''
  });
  const [errors, setErrors] = useState({});

  const filteredEquipment = getFilteredEquipment();
  const categories = [...new Set(useAdminStore.getState().equipment.map(e => e.category))];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Equipment name is required';
    if (!formData.serialNumber.trim()) newErrors.serialNumber = 'Serial number is required';
    if (!formData.assignedTeamId) newErrors.assignedTeamId = 'Team assignment is required';
    
    // Check for duplicate serial number
    const existingEquipment = useAdminStore.getState().equipment;
    if (existingEquipment.some(e => e.serialNumber === formData.serialNumber)) {
      newErrors.serialNumber = 'Serial number already exists';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    addEquipment({
      ...formData,
      assignedTeamId: parseInt(formData.assignedTeamId)
    });
    
    setFormData({
      name: '',
      category: '',
      serialNumber: '',
      purchaseDate: '',
      warrantyTill: '',
      location: '',
      assignedTeamId: ''
    });
    setErrors({});
    setShowAddModal(false);
  };

  const handleScrap = () => {
    if (selectedEquipment) {
      markAsScrap(selectedEquipment.id);
      setShowScrapModal(false);
      setSelectedEquipment(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setTeamFilter('');
    setStatusFilter('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Equipment Management</h1>
          <p className="text-gray-400">Manage company assets and maintenance assignments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Equipment
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or serial number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="select bg-gray-700 border-gray-600 text-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="select bg-gray-700 border-gray-600 text-white"
            >
              <option value="">All Teams</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select bg-gray-700 border-gray-600 text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="scrapped">Scrapped</option>
            </select>

            {(searchTerm || categoryFilter || teamFilter || statusFilter) && (
              <button
                onClick={clearFilters}
                className="btn btn-outline btn-sm text-gray-400 border-gray-600 hover:bg-gray-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Equipment List */}
      {filteredEquipment.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {useAdminStore.getState().equipment.length === 0 ? 'No equipment added yet' : 'No equipment found'}
          </h3>
          <p className="text-gray-400 mb-6">
            {useAdminStore.getState().equipment.length === 0 
              ? 'Start by adding your first piece of equipment to track maintenance'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
          {useAdminStore.getState().equipment.length === 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
            >
              <Plus className="w-4 h-4" />
              Add Equipment
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="text-gray-300">Equipment</th>
                    <th className="text-gray-300">Category</th>
                    <th className="text-gray-300">Serial Number</th>
                    <th className="text-gray-300">Team</th>
                    <th className="text-gray-300">Location</th>
                    <th className="text-gray-300">Status</th>
                    <th className="text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipment.map((equipment) => (
                    <tr key={equipment.id} className="hover:bg-gray-700">
                      <td>
                        <div>
                          <div className="font-medium text-white">{equipment.name}</div>
                          <div className="text-sm text-gray-400">
                            Purchased: {new Date(equipment.purchaseDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-300">{equipment.category}</td>
                      <td className="text-gray-300 font-mono text-sm">{equipment.serialNumber}</td>
                      <td className="text-gray-300">{equipment.assignedTeamName}</td>
                      <td className="text-gray-300">{equipment.location}</td>
                      <td>
                        <span className={`badge ${
                          equipment.status === 'active' 
                            ? 'badge-success' 
                            : 'badge-error'
                        }`}>
                          {equipment.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-sm btn-ghost text-gray-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </button>
                          {equipment.status === 'active' && (
                            <button
                              onClick={() => {
                                setSelectedEquipment(equipment);
                                setShowScrapModal(true);
                              }}
                              className="btn btn-sm btn-ghost text-red-400 hover:text-red-300"
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {filteredEquipment.map((equipment) => (
              <div key={equipment.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{equipment.name}</h3>
                    <p className="text-sm text-gray-400">{equipment.category}</p>
                  </div>
                  <span className={`badge ${
                    equipment.status === 'active' 
                      ? 'badge-success' 
                      : 'badge-error'
                  }`}>
                    {equipment.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Serial:</span>
                    <span className="text-gray-300 font-mono">{equipment.serialNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Team:</span>
                    <span className="text-gray-300">{equipment.assignedTeamName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-gray-300">{equipment.location}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button className="btn btn-sm btn-ghost text-gray-400 hover:text-white">
                    <Eye className="w-4 h-4" />
                  </button>
                  {equipment.status === 'active' && (
                    <button
                      onClick={() => {
                        setSelectedEquipment(equipment);
                        setShowScrapModal(true);
                      }}
                      className="btn btn-sm btn-ghost text-red-400 hover:text-red-300"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Equipment Modal */}
      {showAddModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-gray-800 border border-gray-700">
            <h3 className="font-bold text-lg text-white mb-4">Add New Equipment</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Equipment Name *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input bg-gray-700 border-gray-600 text-white ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Enter equipment name"
                  />
                  {errors.name && <span className="text-red-400 text-sm">{errors.name}</span>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Category</span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input bg-gray-700 border-gray-600 text-white"
                    placeholder="e.g., Production, IT Equipment"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Serial Number *</span>
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    className={`input bg-gray-700 border-gray-600 text-white ${errors.serialNumber ? 'border-red-500' : ''}`}
                    placeholder="Enter serial number"
                  />
                  {errors.serialNumber && <span className="text-red-400 text-sm">{errors.serialNumber}</span>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Assigned Team *</span>
                  </label>
                  <select
                    name="assignedTeamId"
                    value={formData.assignedTeamId}
                    onChange={handleChange}
                    className={`select bg-gray-700 border-gray-600 text-white ${errors.assignedTeamId ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select a team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                  {errors.assignedTeamId && <span className="text-red-400 text-sm">{errors.assignedTeamId}</span>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Purchase Date</span>
                  </label>
                  <input
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className="input bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Warranty Till</span>
                  </label>
                  <input
                    type="date"
                    name="warrantyTill"
                    value={formData.warrantyTill}
                    onChange={handleChange}
                    className="input bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">Location</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter equipment location"
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      name: '',
                      category: '',
                      serialNumber: '',
                      purchaseDate: '',
                      warrantyTill: '',
                      location: '',
                      assignedTeamId: ''
                    });
                    setErrors({});
                  }}
                  className="btn btn-ghost text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
                >
                  Add Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scrap Confirmation Modal */}
      {showScrapModal && selectedEquipment && (
        <div className="modal modal-open">
          <div className="modal-box bg-gray-800 border border-gray-700">
            <h3 className="font-bold text-lg text-white mb-4">Mark as Scrapped</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to mark <strong>{selectedEquipment.name}</strong> as scrapped? 
              This action will make the equipment unavailable for new maintenance requests.
            </p>
            
            <div className="modal-action">
              <button
                onClick={() => {
                  setShowScrapModal(false);
                  setSelectedEquipment(null);
                }}
                className="btn btn-ghost text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleScrap}
                className="btn bg-red-600 hover:bg-red-700 border-red-600 text-white"
              >
                Mark as Scrapped
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipment;