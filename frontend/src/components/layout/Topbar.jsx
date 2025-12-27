import { Menu, LogOut, User } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const Topbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-400 hover:text-white mr-4"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-white">
            Admin Dashboard
          </h2>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Admin Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">
                {user?.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                {user?.role || 'admin'}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;