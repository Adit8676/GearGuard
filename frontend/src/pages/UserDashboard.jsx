import { useState, useEffect } from 'react';
import { Plus, Clock, CheckCircle, AlertCircle, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const UserDashboard = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    document.title = 'Dashboard - GearGuard';
  }, []);

  // Mock data for user requests
  const [requests] = useState([
    {
      id: 1,
      equipment: 'CNC Machine 01',
      issue: 'Machine making unusual noise',
      status: 'pending',
      priority: 'high',
      createdAt: '2025-12-27',
      assignedTo: 'Mechanical Team'
    },
    {
      id: 2,
      equipment: 'Server Rack SR-01',
      issue: 'Network connectivity issues',
      status: 'in_progress',
      priority: 'medium',
      createdAt: '2025-12-26',
      assignedTo: 'IT Support Team'
    },
    {
      id: 3,
      equipment: 'Forklift FL-205',
      issue: 'Battery replacement needed',
      status: 'completed',
      priority: 'low',
      createdAt: '2025-12-25',
      assignedTo: 'Mechanical Team'
    }
  ]);

  const stats = {
    totalRequests: requests.length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    inProgressRequests: requests.filter(r => r.status === 'in_progress').length,
    completedRequests: requests.filter(r => r.status === 'completed').length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600';
      case 'in_progress': return 'bg-blue-600';
      case 'completed': return 'bg-emerald-600';
      default: return 'bg-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const statCards = [
    {
      title: 'Total Requests',
      value: stats.totalRequests,
      icon: Wrench,
      color: 'bg-blue-600'
    },
    {
      title: 'Pending',
      value: stats.pendingRequests,
      icon: Clock,
      color: 'bg-yellow-600'
    },
    {
      title: 'In Progress',
      value: stats.inProgressRequests,
      icon: AlertCircle,
      color: 'bg-blue-600'
    },
    {
      title: 'Completed',
      value: stats.completedRequests,
      icon: CheckCircle,
      color: 'bg-emerald-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-400">Track your maintenance requests and equipment status</p>
        </div>
        <Link
          to="/dashboard/requests"
          className="btn bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
        >
          <Plus className="w-4 h-4" />
          New Request
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Requests */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Requests</h2>
          <Link
            to="/dashboard/history"
            className="text-emerald-400 hover:text-emerald-300 text-sm"
          >
            View All
          </Link>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {requests.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-white">{request.equipment}</h3>
                    <span className={`badge ${getStatusColor(request.status)} text-white text-xs`}>
                      {request.status.replace('_', ' ')}
                    </span>
                    <span className={`text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority} priority
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-1">{request.issue}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span>Assigned to: {request.assignedTo}</span>
                    <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Create New Request</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Report equipment issues or request maintenance services
          </p>
          <Link
            to="/dashboard/requests"
            className="btn bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white w-full"
          >
            Create Request
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Request History</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            View all your past and current maintenance requests
          </p>
          <Link
            to="/dashboard/history"
            className="btn bg-blue-600 hover:bg-blue-700 border-blue-600 text-white w-full"
          >
            View History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;