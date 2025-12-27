import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Kanban, 
  Calendar, 
  LogOut, 
  Menu, 
  X,
  Wrench,
  Clock,
  CheckCircle
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useMaintenanceStore from '../../store/maintenanceStore';
import KanbanBoard from './KanbanBoard';
import CalendarView from './CalendarView';

const TechnicianDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { requests, fetchRequests } = useMaintenanceStore();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Filter requests based on user role
  const getFilteredRequests = () => {
    if (!user) return [];
    
    if (user.role === 'manager') {
      // Manager sees all requests from their managed teams
      return requests.filter(req => 
        user.managedTeams?.includes(req.teamId) || req.teamName === user.teamName
      );
    } else if (user.role === 'technician') {
      // Technician sees requests from their team
      return requests.filter(req => req.teamId === user.teamId || req.teamName === user.teamName);
    }
    
    return [];
  };

  const filteredRequests = getFilteredRequests();

  // Calculate stats
  const stats = {
    new: filteredRequests.filter(req => req.status === 'new').length,
    inProgress: filteredRequests.filter(req => req.status === 'in_progress').length,
    repaired: filteredRequests.filter(req => req.status === 'repaired').length
  };

  const menuItems = [
    { path: '/technician', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/technician/kanban', icon: Kanban, label: 'Kanban Board' },
    { path: '/technician/calendar', icon: Calendar, label: 'Calendar' }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const DashboardOverview = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-400">
          Team: <span className="text-emerald-400">{user?.teamName || 'Not assigned'}</span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">New Requests</p>
              <p className="text-2xl font-bold text-white">{stats.new}</p>
            </div>
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <Wrench className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Repaired</p>
              <p className="text-2xl font-bold text-white">{stats.repaired}</p>
            </div>
            <div className="bg-emerald-500/20 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/technician/kanban"
            className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Kanban className="w-8 h-8 text-emerald-400 mr-4" />
            <div>
              <h3 className="text-white font-medium">Kanban Board</h3>
              <p className="text-gray-400 text-sm">Manage maintenance tasks</p>
            </div>
          </Link>
          
          <Link
            to="/technician/calendar"
            className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Calendar className="w-8 h-8 text-emerald-400 mr-4" />
            <div>
              <h3 className="text-white font-medium">Calendar View</h3>
              <p className="text-gray-400 text-sm">View scheduled maintenance</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-gray-800 border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">GearGuard</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'T'}
              </span>
            </div>
            <div>
              <div className="text-white font-medium">{user?.name || 'Technician'}</div>
              <div className="text-gray-400 text-sm capitalize">{user?.role || 'technician'}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center px-6 py-4 text-base font-medium transition-colors
                  ${active 
                    ? 'text-emerald-400 bg-emerald-900/20 border-r-2 border-emerald-400' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }
                `}
              >
                <Icon className="w-6 h-6 mr-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-gray-700">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Page Content */}
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="*" element={<Navigate to="/technician" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default TechnicianDashboard;