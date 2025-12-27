import { useState, useEffect } from 'react';
import { Search, ArrowUp, UserX, UserCheck } from 'lucide-react';
import useAdminStore from '../../store/adminStore';
import usePageTitle from '../../hooks/usePageTitle';

const Users = () => {
  usePageTitle('User Management');
  const { users = [], fetchUsers, upgradeUserRole, disableUser, enableUser } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    if (fetchUsers) {
      fetchUsers();
    }
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-600';
      case 'manager': return 'bg-blue-600';
      case 'technician': return 'bg-emerald-600';
      default: return 'bg-gray-600';
    }
  };

  const handleUpgradeRole = (user) => {
    setSelectedUser(user);
    setNewRole('');
    setShowUpgradeModal(true);
  };

  const handleUpgradeSubmit = () => {
    if (newRole && selectedUser) {
      upgradeUserRole(selectedUser._id, newRole);
      setShowUpgradeModal(false);
      setSelectedUser(null);
      setNewRole('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage user roles and permissions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="select bg-gray-700 border-gray-600 text-white"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="technician">Technicians</option>
              <option value="manager">Managers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-gray-300">User</th>
                <th className="text-gray-300">Role</th>
                <th className="text-gray-300">Status</th>
                <th className="text-gray-300">Joined</th>
                <th className="text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-700">
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getRoleBadgeColor(user.role)} text-white`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.status === 'active' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="text-gray-300">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        {/* Enable/Disable User - Show for all except admin */}
                        {user.role !== 'admin' && (
                          user.status === 'active' ? (
                            <button
                              onClick={() => disableUser(user._id)}
                              className="btn btn-sm bg-red-600 hover:bg-red-700 text-white"
                              title="Disable User"
                            >
                              <UserX className="w-4 h-4" />
                              Disable
                            </button>
                          ) : (
                            <button
                              onClick={() => enableUser(user._id)}
                              className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white"
                              title="Enable User"
                            >
                              <UserCheck className="w-4 h-4" />
                              Enable
                            </button>
                          )
                        )}
                        
                        {/* Upgrade Role - Only show for users with 'user' role */}
                        {user.role === 'user' && (
                          <button
                            onClick={() => handleUpgradeRole(user)}
                            className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white"
                            title="Upgrade Role"
                          >
                            <ArrowUp className="w-4 h-4" />
                            Upgrade Role
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Role Modal */}
      {showUpgradeModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Upgrade Role - {selectedUser.name}
            </h3>
            
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Current role: <span className="text-white font-medium">{selectedUser.role}</span>
              </p>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">Select new role:</span>
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="select bg-gray-700 border-gray-600 text-white"
                >
                  <option value="">Choose a role</option>
                  <option value="technician">Technician</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  setSelectedUser(null);
                  setNewRole('');
                }}
                className="btn btn-ghost text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpgradeSubmit}
                disabled={!newRole}
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
              >
                Upgrade Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;