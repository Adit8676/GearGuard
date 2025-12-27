import { useState, useEffect } from 'react';
import { Search, Plus, Clock, AlertTriangle, CheckCircle, XCircle, Wrench } from 'lucide-react';
import useMaintenanceStore from '../../store/maintenanceStore';
import useAdminStore from '../../store/adminStore';
import usePageTitle from '../../hooks/usePageTitle';

const Maintenance = () => {
  usePageTitle('Maintenance Requests');
  
  console.log('Maintenance component loaded');
  
  const {
    requests,
    isLoading,
    error,
    searchTerm,
    statusFilter,
    typeFilter,
    teamFilter,
    setSearchTerm,
    setStatusFilter,
    setTypeFilter,
    setTeamFilter,
    fetchRequests,
    createRequest,
    updateStatus,
    getFilteredRequests
  } = useMaintenanceStore();

  const { equipment, teams } = useAdminStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    type: 'corrective',
    equipmentId: '',
    scheduledDate: '',
    duration: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log('Maintenance component mounted, fetching requests...');
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = getFilteredRequests();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <Wrench className="w-4 h-4" />;
      case 'repaired': return <CheckCircle className="w-4 h-4" />;
      case 'scrap': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'badge-info';
      case 'in_progress': return 'badge-warning';
      case 'repaired': return 'badge-success';
      case 'scrap': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  const getTypeColor = (type) => {
    return type === 'preventive' ? 'badge-primary' : 'badge-secondary';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.equipmentId) newErrors.equipmentId = 'Equipment is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedEquipment = equipment.find(eq => eq.id.toString() === formData.equipmentId);
    const requestData = {
      ...formData,
      equipmentName: selectedEquipment?.name || '',
      teamName: selectedEquipment?.assignedTeamName || '',
      teamId: selectedEquipment?.assignedTeamId || null
    };

    await createRequest(requestData);
    setFormData({
      subject: '',
      description: '',
      type: 'corrective',
      equipmentId: '',
      scheduledDate: '',
      duration: ''
    });
    setErrors({});
    setShowCreateModal(false);
  };

  const handleStatusUpdate = async () => {
    if (selectedRequest && newStatus) {
      await updateStatus(selectedRequest._id, newStatus);
      setShowStatusModal(false);
      setSelectedRequest(null);
      setNewStatus('');
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
    setStatusFilter('');
    setTypeFilter('');
    setTeamFilter('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Maintenance Requests</h1>
          <p className="text-gray-400">Manage equipment maintenance and repairs</p>
          {error && (
            <p className="text-yellow-400 text-sm mt-1">⚠️ {error}</p>
          )}
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
        >
          <Plus className="w-4 h-4" />
          Create Request
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
                placeholder="Search by subject or equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select bg-gray-700 border-gray-600 text-white"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="repaired">Repaired</option>
              <option value="scrap">Scrap</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="select bg-gray-700 border-gray-600 text-white"
            >
              <option value="">All Types</option>
              <option value="corrective">Corrective</option>
              <option value="preventive">Preventive</option>
            </select>

            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="select bg-gray-700 border-gray-600 text-white"
            >
              <option value="">All Teams</option>
              {teams.map(team => (
                <option key={team.id} value={team.name}>{team.name}</option>
              ))}
            </select>

            {(searchTerm || statusFilter || typeFilter || teamFilter) && (
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg text-emerald-500"></span>
        </div>
      )}

      {/* Requests List */}
      {!isLoading && (
        <>
          {filteredRequests.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 text-center">
              <Wrench className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {requests.length === 0 ? 'No maintenance requests yet' : 'No requests found'}
              </h3>
              <p className="text-gray-400 mb-6">
                {requests.length === 0 
                  ? 'Create your first maintenance request to get started'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {requests.length === 0 && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
                >
                  <Plus className="w-4 h-4" />
                  Create Request
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
                        <th className="text-gray-300">Request</th>
                        <th className="text-gray-300">Equipment</th>
                        <th className="text-gray-300">Team</th>
                        <th className="text-gray-300">Type</th>
                        <th className="text-gray-300">Status</th>
                        <th className="text-gray-300">Scheduled</th>
                        <th className="text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map((request) => (
                        <tr key={request._id} className="hover:bg-gray-700">
                          <td>
                            <div>
                              <div className="font-medium text-white">{request.subject}</div>
                              <div className="text-sm text-gray-400">
                                Created: {new Date(request.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </td>
                          <td className="text-gray-300">{request.equipmentName}</td>
                          <td className="text-gray-300">{request.teamName}</td>
                          <td>
                            <span className={`badge ${getTypeColor(request.type)}`}>
                              {request.type}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${getStatusColor(request.status)} gap-2`}>
                              {getStatusIcon(request.status)}
                              {request.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="text-gray-300">
                            {request.scheduledDate 
                              ? new Date(request.scheduledDate).toLocaleDateString()
                              : '-'
                            }
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setNewStatus('');
                                setShowStatusModal(true);
                              }}
                              className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Update Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {filteredRequests.map((request) => (
                  <div key={request._id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{request.subject}</h3>
                        <p className="text-sm text-gray-400">{request.equipmentName}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`badge ${getTypeColor(request.type)}`}>
                          {request.type}
                        </span>
                        <span className={`badge ${getStatusColor(request.status)} gap-1`}>
                          {getStatusIcon(request.status)}
                          {request.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Team:</span>
                        <span className="text-gray-300">{request.teamName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created:</span>
                        <span className="text-gray-300">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {request.scheduledDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Scheduled:</span>
                          <span className="text-gray-300">
                            {new Date(request.scheduledDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setNewStatus('');
                          setShowStatusModal(true);
                        }}
                        className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-gray-800 border border-gray-700 max-w-2xl">
            <h3 className="font-bold text-lg text-white mb-4">Create Maintenance Request</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text text-gray-300">Subject *</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`input bg-gray-700 border-gray-600 text-white ${errors.subject ? 'border-red-500' : ''}`}
                    placeholder="Brief description of the issue"
                  />
                  {errors.subject && <span className="text-red-400 text-sm">{errors.subject}</span>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Equipment *</span>
                  </label>
                  <select
                    name="equipmentId"
                    value={formData.equipmentId}
                    onChange={handleChange}
                    className={`select bg-gray-700 border-gray-600 text-white ${errors.equipmentId ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select equipment</option>
                    {equipment.filter(eq => eq.status === 'active').map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.name}</option>
                    ))}
                  </select>
                  {errors.equipmentId && <span className="text-red-400 text-sm">{errors.equipmentId}</span>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Type</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="select bg-gray-700 border-gray-600 text-white"
                  >
                    <option value="corrective">Corrective (Breakdown)</option>
                    <option value="preventive">Preventive (Routine)</option>
                  </select>
                </div>

                {formData.type === 'preventive' && (
                  <>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-300">Scheduled Date</span>
                      </label>
                      <input
                        type="date"
                        name="scheduledDate"
                        value={formData.scheduledDate}
                        onChange={handleChange}
                        className="input bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-300">Duration (hours)</span>
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="input bg-gray-700 border-gray-600 text-white"
                        placeholder="Estimated hours"
                        min="1"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">Description</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="textarea bg-gray-700 border-gray-600 text-white"
                  placeholder="Detailed description of the maintenance required"
                  rows="3"
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({
                      subject: '',
                      description: '',
                      type: 'corrective',
                      equipmentId: '',
                      scheduledDate: '',
                      duration: ''
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
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedRequest && (
        <div className="modal modal-open">
          <div className="modal-box bg-gray-800 border border-gray-700">
            <h3 className="font-bold text-lg text-white mb-4">
              Update Status - {selectedRequest.subject}
            </h3>
            
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Current status: <span className="text-white font-medium">{selectedRequest.status.replace('_', ' ')}</span>
              </p>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">New Status:</span>
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="select bg-gray-700 border-gray-600 text-white"
                >
                  <option value="">Choose status</option>
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="repaired">Repaired</option>
                  <option value="scrap">Scrap</option>
                </select>
              </div>
            </div>
            
            <div className="modal-action">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedRequest(null);
                  setNewStatus('');
                }}
                className="btn btn-ghost text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={!newStatus}
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;