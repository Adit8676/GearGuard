import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useRequestStore from '../../store/requestStore';
import usePageTitle from '../../hooks/usePageTitle';

const MyRequests = () => {
  usePageTitle('My Requests - GearGuard');
  const { requests, fetchMyRequests, loading } = useRequestStore();
  
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  const getStatusBadge = (status) => {
    const badges = {
      new: 'badge-warning',
      in_progress: 'badge-info',
      repaired: 'badge-success',
      scrap: 'badge-error'
    };
    const labels = {
      new: 'Pending',
      in_progress: 'In Progress',
      repaired: 'Repaired',
      scrap: 'Scrapped'
    };
    return { class: badges[status] || 'badge-neutral', label: labels[status] || status };
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'badge-success',
      medium: 'badge-warning',
      high: 'badge-error'
    };
    return badges[priority] || 'badge-neutral';
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = !filters.status || request.status === filters.status;
    const matchesPriority = !filters.priority || request.priority === filters.priority;
    const matchesSearch = !filters.search || 
      request.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
      request.equipmentName.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">My Requests</h1>
          <Link
            to="/user/new-request"
            className="btn btn-success"
          >
            + New Request
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by subject or equipment..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="new">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="repaired">Repaired</option>
                <option value="scrap">Scrapped</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="loading loading-spinner loading-lg text-green-500"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-12 text-center">
            <p className="text-gray-400 text-lg mb-4">No requests found</p>
            <Link to="/user/new-request" className="btn btn-success">
              Create Your First Request
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-slate-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Equipment</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Subject</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Priority</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Team</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredRequests.map(request => {
                    const statusBadge = getStatusBadge(request.status);
                    return (
                      <tr key={request._id} className="hover:bg-slate-700 transition-colors">
                        <td className="px-6 py-4 text-white font-medium">{request.equipmentName}</td>
                        <td className="px-6 py-4 text-gray-300">{request.subject}</td>
                        <td className="px-6 py-4">
                          <span className={`badge ${statusBadge.class} badge-sm whitespace-nowrap`}>
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`badge ${getPriorityBadge(request.priority)} badge-sm`}>
                            {request.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{request.teamName}</td>
                        <td className="px-6 py-4 text-gray-300">{formatDate(request.createdAt)}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-green-400 hover:text-green-300 text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredRequests.map(request => {
                const statusBadge = getStatusBadge(request.status);
                return (
                  <div key={request._id} className="bg-slate-800 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-white font-semibold text-lg">{request.equipmentName}</h3>
                      <div className="flex gap-2">
                        <span className={`badge ${statusBadge.class} badge-sm`}>
                          {statusBadge.label}
                        </span>
                        <span className={`badge ${getPriorityBadge(request.priority)} badge-sm`}>
                          {request.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-3">{request.subject}</p>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>{request.teamName}</span>
                      <span>{formatDate(request.createdAt)}</span>
                    </div>
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="mt-4 text-green-400 hover:text-green-300 text-sm"
                    >
                      View Details →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Request Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-white">Request Details</h2>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Equipment</label>
                    <p className="text-white">{selectedRequest.equipmentName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                    <p className="text-white">{selectedRequest.subject}</p>
                  </div>
                  
                  {selectedRequest.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                      <p className="text-gray-300">{selectedRequest.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                      <span className={`badge ${getStatusBadge(selectedRequest.status).class}`}>
                        {getStatusBadge(selectedRequest.status).label}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                      <span className={`badge ${getPriorityBadge(selectedRequest.priority)}`}>
                        {selectedRequest.priority}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Assigned Team</label>
                    <p className="text-white">{selectedRequest.teamName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Created Date</label>
                    <p className="text-gray-300">{formatDate(selectedRequest.createdAt)}</p>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="btn btn-outline"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;