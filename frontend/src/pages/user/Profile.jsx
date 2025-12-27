import usePageTitle from '../../hooks/usePageTitle';
import useAuthStore from '../../store/useAuthStore';

const Profile = () => {
  usePageTitle('Profile - GearGuard');
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-8">User Profile</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <div className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white">
                {user?.name || 'N/A'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white">
                {user?.email || 'N/A'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
              <div className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white capitalize">
                {user?.role || 'N/A'}
              </div>
            </div>
            
            <div className="pt-6">
              <p className="text-gray-400 text-center">Profile management features coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;