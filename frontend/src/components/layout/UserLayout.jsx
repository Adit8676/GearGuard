import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Plus, 
  Clock, 
  User,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', exact: true },
    { path: '/user/new-request', icon: Plus, label: 'New Request' },
    { path: '/user/my-requests', icon: Clock, label: 'My Requests' },
    { path: '/user/profile', icon: User, label: 'Profile' }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
  };

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
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <div className="text-white font-medium">{user?.name || 'User'}</div>
              <div className="text-gray-400 text-sm capitalize">{user?.role || 'user'}</div>
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
            onClick={handleLogout}
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
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;