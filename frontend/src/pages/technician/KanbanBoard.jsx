import { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Trash2
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useMaintenanceStore from '../../store/maintenanceStore';
import toast from 'react-hot-toast';

const KanbanBoard = () => {
  const { user } = useAuthStore();
  const { requests, fetchRequests, updateStatus } = useMaintenanceStore();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Filter requests based on user role
  const getFilteredRequests = () => {
    if (!user) return [];
    
    if (user.role === 'manager') {
      return requests.filter(req => 
        user.managedTeams?.includes(req.teamId) || req.teamName === user.teamName
      );
    } else if (user.role === 'technician') {
      return requests.filter(req => req.teamId === user.teamId || req.teamName === user.teamName);
    }
    
    return [];
  };

  const filteredRequests = getFilteredRequests();

  // Group requests by status
  const columns = {
    new: {
      title: 'New',
      color: 'bg-yellow-500',
      requests: filteredRequests.filter(req => req.status === 'new')
    },
    in_progress: {
      title: 'In Progress',
      color: 'bg-blue-500',
      requests: filteredRequests.filter(req => req.status === 'in_progress')
    },
    repaired: {
      title: 'Repaired',
      color: 'bg-emerald-500',
      requests: filteredRequests.filter(req => req.status === 'repaired')
    },
    scrap: {
      title: 'Scrap',
      color: 'bg-red-500',
      requests: filteredRequests.filter(req => req.status === 'scrap')
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAcceptRequest = async (requestId) => {
    if (user.role !== 'technician') return;
    
    try {
      await updateStatus(requestId, 'in_progress', user._id);
      toast.success('Request accepted successfully!');
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await updateStatus(requestId, newStatus);
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString();
  };

  const RequestCard = ({ request }) => {
    const canAccept = user.role === 'technician' && request.status === 'new' && !request.assignedTo;
    const canMoveToRepaired = user.role === 'technician' && request.status === 'in_progress' && request.assignedTo === user._id;
    const canMoveToScrap = user.role === 'technician' && request.status === 'in_progress' && request.assignedTo === user._id;
    const canAssign = user.role === 'manager' && request.status === 'new';

    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-white font-medium text-sm leading-tight">
            {request.equipmentName}
          </h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(request.priority)}`}>
            {request.priority || 'medium'}
          </div>
        </div>

        {/* Subject */}
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
          {request.subject}
        </p>

        {/* Date */}
        <div className="flex items-center text-gray-400 text-xs mb-3">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(request.createdAt)}
        </div>

        {/* Assigned Technician */}
        {request.assignedTo && (
          <div className="flex items-center text-gray-400 text-xs mb-3">
            <User className="w-3 h-3 mr-1" />
            {request.assignedToName || 'Assigned'}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {canAccept && (
            <button
              onClick={() => handleAcceptRequest(request._id)}
              className="flex items-center px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-md transition-colors"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Accept
            </button>
          )}

          {canMoveToRepaired && (
            <button
              onClick={() => handleStatusChange(request._id, 'repaired')}
              className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md transition-colors"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Complete
            </button>
          )}

          {canMoveToScrap && (
            <button
              onClick={() => handleStatusChange(request._id, 'scrap')}
              className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Scrap
            </button>
          )}
        </div>
      </div>
    );
  };

  const Column = ({ title, color, requests, status }) => (
    <div className="flex-1 min-w-80">
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
          <h2 className="text-white font-semibold">{title}</h2>
          <span className="ml-2 bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
            {requests.length}
          </span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        {requests.length === 0 ? (
          <div className="text-gray-500 text-center py-8 text-sm">
            No {title.toLowerCase()} requests
          </div>
        ) : (
          requests.map(request => (
            <RequestCard key={request._id} request={request} />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Kanban Board</h1>
        <p className="text-gray-400">Manage maintenance requests</p>
      </div>

      {/* Kanban Columns */}
      <div className="flex gap-6 overflow-x-auto pb-6">
        {Object.entries(columns).map(([status, column]) => (
          <Column
            key={status}
            title={column.title}
            color={column.color}
            requests={column.requests}
            status={status}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-white font-medium mb-3">Actions Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="text-gray-300">
            <strong className="text-emerald-400">Technician:</strong>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• Accept new requests</li>
              <li>• Move in-progress to repaired/scrap</li>
            </ul>
          </div>
          <div className="text-gray-300">
            <strong className="text-blue-400">Manager:</strong>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• Assign technicians to requests</li>
              <li>• View all team requests</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;