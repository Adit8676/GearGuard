import { useState, useEffect } from 'react';
import { Clock, Wrench, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import useMaintenanceStore from '../../store/maintenanceStore';
import usePageTitle from '../../hooks/usePageTitle';

const MaintenanceRequests = () => {
  usePageTitle('Maintenance Requests');
  
  const { requests, isLoading, fetchRequests } = useMaintenanceStore();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

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
      case 'new': return 'bg-blue-600';
      case 'in_progress': return 'bg-yellow-600';
      case 'repaired': return 'bg-green-600';
      case 'scrap': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg text-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Maintenance Requests</h1>
      
      {/* Desktop Table */}
      <div className="hidden lg:block bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-300">Equipment</th>
              <th className="text-left p-4 text-gray-300">Subject</th>
              <th className="text-left p-4 text-gray-300">Status</th>
              <th className="text-left p-4 text-gray-300">Priority</th>
              <th className="text-left p-4 text-gray-300">Team</th>
              <th className="text-left p-4 text-gray-300">Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="p-4 text-white font-medium">{request.equipmentName}</td>
                <td className="p-4 text-gray-300">{request.subject}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {request.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    request.priority === 'high' ? 'bg-red-600 text-white' :
                    request.priority === 'medium' ? 'bg-yellow-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {request.priority}
                  </span>
                </td>
                <td className="p-4 text-gray-300">{request.teamName}</td>
                <td className="p-4 text-gray-300">
                  {new Date(request.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {requests.map((request) => (
          <div key={request._id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-white">{request.equipmentName}</h3>
                <p className="text-sm text-gray-400">{request.subject}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs ${getStatusColor(request.status)}`}>
                {getStatusIcon(request.status)}
                {request.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-400">Priority:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  request.priority === 'high' ? 'bg-red-600 text-white' :
                  request.priority === 'medium' ? 'bg-yellow-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {request.priority}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Team:</span>
                <span className="text-gray-300 ml-2">{request.teamName}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400">Date:</span>
                <span className="text-gray-300 ml-2">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {requests.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-400">No maintenance requests found</p>
        </div>
      )}
    </div>
  );
};

export default MaintenanceRequests;