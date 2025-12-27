import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useAuthStore from './store/useAuthStore';
import SignUp from './pages/auth/SignUp';
import VerifyOtp from './pages/auth/VerifyOtp';
import Login from './pages/auth/Login';
import AdminLayout from './components/layout/AdminLayout';
import UserLayout from './components/layout/UserLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Users from './pages/admin/Users';
import Teams from './pages/admin/Teams';
import Equipment from './pages/admin/Equipment';
import MaintenanceRequests from './pages/admin/MaintenanceRequests';
import Settings from './pages/admin/Settings';
import NewRequest from './pages/user/NewRequest';
import MyRequests from './pages/user/MyRequests';
import Profile from './pages/user/Profile';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import LandingPage from './pages/LandingPage';

// User Dashboard component
const Dashboard = () => {
  const { user } = useAuthStore();
  
  // If user is admin, redirect to admin panel
  if (user?.role === 'admin') {
    return <Navigate to="/admin" />;
  }
  
  // Regular user dashboard with layout (including technicians and managers)
  return (
    <UserLayout>
      <UserDashboard />
    </UserLayout>
  );
};

function App() {
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/landing" element={<LandingPage />} />
          
          {/* Public Routes */}
          <Route 
            path="/auth/signup" 
            element={user ? <Navigate to="/dashboard" /> : <SignUp />} 
          />
          <Route 
            path="/auth/verify-otp" 
            element={user ? <Navigate to="/dashboard" /> : <VerifyOtp />} 
          />
          <Route 
            path="/auth/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login />} 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/auth/login" />} 
          />
          
          {/* User Routes */}
          <Route 
            path="/user/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/auth/login" />} 
          />
          <Route 
            path="/user/new-request" 
            element={user ? (
              <UserLayout>
                <NewRequest />
              </UserLayout>
            ) : <Navigate to="/auth/login" />} 
          />
          <Route 
            path="/user/my-requests" 
            element={user ? (
              <UserLayout>
                <MyRequests />
              </UserLayout>
            ) : <Navigate to="/auth/login" />} 
          />
          <Route 
            path="/user/profile" 
            element={user ? (
              <UserLayout>
                <Profile />
              </UserLayout>
            ) : <Navigate to="/auth/login" />} 
          />
          
          {/* Technician Routes */}
          <Route 
            path="/technician/*" 
            element={<TechnicianDashboard />}
          />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            user && user.role === 'admin' ? (
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            ) : <Navigate to="/auth/login" />
          } />
          <Route path="/admin/users" element={
            user && user.role === 'admin' ? (
              <AdminLayout>
                <Users />
              </AdminLayout>
            ) : <Navigate to="/auth/login" />
          } />
          <Route path="/admin/teams" element={
            user && user.role === 'admin' ? (
              <AdminLayout>
                <Teams />
              </AdminLayout>
            ) : <Navigate to="/auth/login" />
          } />
          <Route path="/admin/equipment" element={
            user && user.role === 'admin' ? (
              <AdminLayout>
                <Equipment />
              </AdminLayout>
            ) : <Navigate to="/auth/login" />
          } />
          <Route path="/admin/maintenance" element={
            user && user.role === 'admin' ? (
              <AdminLayout>
                <MaintenanceRequests />
              </AdminLayout>
            ) : <Navigate to="/auth/login" />
          } />
          <Route path="/admin/settings" element={
            user && user.role === 'admin' ? (
              <AdminLayout>
                <Settings />
              </AdminLayout>
            ) : <Navigate to="/auth/login" />
          } />
          
          {/* Default Redirect */}
          <Route 
            path="/" 
            element={<LandingPage />}
          />
        </Routes>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;