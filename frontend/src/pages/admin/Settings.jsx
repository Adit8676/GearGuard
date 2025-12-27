import { useState } from 'react';
import { User, Lock, Bell, Shield } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import usePageTitle from '../../hooks/usePageTitle';

const Settings = () => {
  usePageTitle('Settings');
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Shield }
  ];

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Update profile logic here
    console.log('Profile updated:', profileData);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Change password logic here
    console.log('Password change requested');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <nav className="p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                      ${activeTab === tab.id 
                        ? 'bg-emerald-600 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Profile Information</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text text-gray-300">Full Name</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="input w-full bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-gray-300">Email Address</span>
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="input w-full bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-gray-300">Role</span>
                    </label>
                    <input
                      type="text"
                      value={user?.role || 'admin'}
                      disabled
                      className="input w-full bg-gray-600 border-gray-600 text-gray-400"
                    />
                  </div>
                  <div className="pt-4">
                    <button type="submit" className="btn bg-emerald-600 hover:bg-emerald-700 text-white">
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text text-gray-300">Current Password</span>
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="input w-full bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-gray-300">New Password</span>
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="input w-full bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-gray-300">Confirm New Password</span>
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="input w-full bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="pt-4">
                    <button type="submit" className="btn bg-emerald-600 hover:bg-emerald-700 text-white">
                      Change Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Email Notifications</h4>
                      <p className="text-gray-400 text-sm">Receive notifications via email</p>
                    </div>
                    <input type="checkbox" className="toggle toggle-success" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Maintenance Alerts</h4>
                      <p className="text-gray-400 text-sm">Get notified about urgent maintenance requests</p>
                    </div>
                    <input type="checkbox" className="toggle toggle-success" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Weekly Reports</h4>
                      <p className="text-gray-400 text-sm">Receive weekly summary reports</p>
                    </div>
                    <input type="checkbox" className="toggle toggle-success" />
                  </div>
                </div>
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">System Settings</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-medium mb-2">Maintenance Request Auto-Assignment</h4>
                    <p className="text-gray-400 text-sm mb-3">Automatically assign requests to teams based on equipment</p>
                    <input type="checkbox" className="toggle toggle-success" defaultChecked />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Data Retention</h4>
                    <p className="text-gray-400 text-sm mb-3">How long to keep completed maintenance records</p>
                    <select className="select bg-gray-700 border-gray-600 text-white">
                      <option>6 months</option>
                      <option>1 year</option>
                      <option>2 years</option>
                      <option>Forever</option>
                    </select>
                  </div>
                  <div className="pt-4">
                    <button className="btn bg-emerald-600 hover:bg-emerald-700 text-white">
                      Save System Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;