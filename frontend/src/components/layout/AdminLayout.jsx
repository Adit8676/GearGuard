import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AdminLayout = ({ children }) => {
  const { user, checkAuth } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };
    initAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-emerald-500"></div>
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect if not admin
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You don't have permission to access this area.</p>
          <button 
            onClick={() => window.history.back()}
            className="btn bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;