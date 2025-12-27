import { useState, useEffect } from 'react';
import { Users, Plus, UserPlus, UserMinus } from 'lucide-react';
import useAdminStore from '../../store/adminStore';
import usePageTitle from '../../hooks/usePageTitle';

const Teams = () => {
  usePageTitle('Team Management');
  
  const { 
    teams, 
    unassignedUsers, 
    fetchTeams, 
    fetchUnassignedUsers, 
    createTeam, 
    addMemberToTeam, 
    removeMemberFromTeam 
  } = useAdminStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTeams();
    fetchUnassignedUsers();
  }, [fetchTeams, fetchUnassignedUsers]);

  const technicians = unassignedUsers.filter(user => user.role === 'technician');
  const managers = unassignedUsers.filter(user => user.role === 'manager');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Team name is required';
    
    // Check if at least one technician is selected
    const selectedTechnicians = selectedMembers.filter(memberId => 
      technicians.some(tech => tech._id === memberId)
    );
    if (selectedTechnicians.length === 0) {
      newErrors.technicians = 'At least one technician must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await createTeam({
        ...formData,
        members: selectedMembers
      });
      setFormData({ name: '' });
      setSelectedMembers([]);
      setErrors({});
      setShowCreateModal(false);
      fetchUnassignedUsers(); // Refresh unassigned users
    } catch (error) {
      // Error handled in store
    }
  };

  const handleMemberToggle = (userId) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddMember = async (teamId, userId) => {
    await addMemberToTeam(teamId, userId);
  };

  const handleRemoveMember = async (teamId, userId) => {
    await removeMemberFromTeam(teamId, userId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Management</h1>
          <p className="text-gray-400">Manage maintenance teams and assign technicians</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Team
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team._id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{team.name}</h3>
              <span className="badge badge-success">{team.members?.length || 0} members</span>
            </div>
            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-medium text-gray-300">Team Members:</h4>
              {team.members && team.members.length > 0 ? (
                <div className="space-y-2">
                  {team.members.map((member) => (
                    <div key={member._id} className="flex items-center justify-between bg-gray-700 rounded p-2">
                      <div>
                        <div className="text-white text-sm">{member.name}</div>
                        <div className="text-gray-400 text-xs">{member.role}</div>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(team._id, member._id)}
                        className="btn btn-sm btn-ghost text-red-400 hover:text-red-300"
                      >
                        <UserMinus className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No members assigned</p>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedTeam(team);
                setShowAssignModal(true);
              }}
              className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white w-full"
            >
              <UserPlus className="w-4 h-4" />
              Assign Member
            </button>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-gray-800 border border-gray-700 max-w-2xl">
            <h3 className="font-bold text-lg text-white mb-4">Create New Team</h3>
            
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">Team Name *</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`input bg-gray-700 border-gray-600 text-white ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter team name"
                />
                {errors.name && <span className="text-red-400 text-sm">{errors.name}</span>}
              </div>

              {/* Available Technicians */}
              {technicians.length > 0 && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Available Technicians *</span>
                    <span className="label-text-alt text-yellow-400">At least one required</span>
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto bg-gray-700 rounded p-3">
                    {technicians.map(user => (
                      <label key={user._id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(user._id)}
                          onChange={() => handleMemberToggle(user._id)}
                          className="checkbox checkbox-sm checkbox-primary"
                        />
                        <div>
                          <div className="text-white text-sm">{user.name}</div>
                          <div className="text-gray-400 text-xs">{user.email}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Managers */}
              {managers.length > 0 && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Available Managers</span>
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto bg-gray-700 rounded p-3">
                    {managers.map(user => (
                      <label key={user._id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(user._id)}
                          onChange={() => handleMemberToggle(user._id)}
                          className="checkbox checkbox-sm checkbox-primary"
                        />
                        <div>
                          <div className="text-white text-sm">{user.name}</div>
                          <div className="text-gray-400 text-xs">{user.email}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {technicians.length === 0 && managers.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-400">No unassigned technicians or managers available</p>
                </div>
              )}

              {technicians.length === 0 && managers.length > 0 && (
                <div className="text-center py-4">
                  <p className="text-yellow-400">⚠️ No unassigned technicians available. Teams require at least one technician.</p>
                </div>
              )}

              {errors.technicians && (
                <div className="text-red-400 text-sm">{errors.technicians}</div>
              )}

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '' });
                    setSelectedMembers([]);
                    setErrors({});
                  }}
                  className="btn btn-ghost text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign User Modal */}
      {showAssignModal && selectedTeam && (
        <div className="modal modal-open">
          <div className="modal-box bg-gray-800 border border-gray-700">
            <h3 className="font-bold text-lg text-white mb-4">
              Assign Member to {selectedTeam.name}
            </h3>
            
            {unassignedUsers.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {unassignedUsers.map(user => (
                    <div key={user._id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                      <div>
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-gray-400 text-sm">{user.role} - {user.email}</div>
                      </div>
                      <button
                        onClick={() => {
                          handleAddMember(selectedTeam._id, user._id);
                          setShowAssignModal(false);
                        }}
                        className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>

                <div className="modal-action">
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedTeam(null);
                    }}
                    className="btn btn-ghost text-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No available technicians or managers to assign</p>
                <div className="modal-action">
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedTeam(null);
                    }}
                    className="btn btn-ghost text-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;