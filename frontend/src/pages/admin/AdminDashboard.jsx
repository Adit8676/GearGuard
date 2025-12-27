import { Users, Wrench, AlertCircle, UserCheck } from 'lucide-react';
import useAdminStore from '../../store/adminStore';
import usePageTitle from '../../hooks/usePageTitle';

const AdminDashboard = () => {
  usePageTitle('Admin Dashboard');
  const { users, teams } = useAdminStore();

  // Calculate stats from existing data
  const stats = {
    totalUsers: users.length,
    totalEquipment: 45, // Mock data
    openRequests: 12, // Mock data
    activeTechnicians: users.filter(u => u.role === 'technician' && u.status === 'active').length
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-600',
      change: '+12%'
    },
    {
      title: 'Total Equipment',
      value: stats.totalEquipment,
      icon: Wrench,
      color: 'bg-emerald-600',
      change: '+5%'
    },
    {
      title: 'Open Requests',
      value: stats.openRequests,
      icon: AlertCircle,
      color: 'bg-orange-600',
      change: '-8%'
    },
    {
      title: 'Active Technicians',
      value: stats.activeTechnicians,
      icon: UserCheck,
      color: 'bg-purple-600',
      change: '+3%'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'New user registered', user: 'john.doe@example.com', time: '2 minutes ago' },
    { id: 2, action: 'Equipment added', user: 'admin', time: '15 minutes ago' },
    { id: 3, action: 'Maintenance request completed', user: 'tech.smith', time: '1 hour ago' },
    { id: 4, action: 'Team created', user: 'admin', time: '2 hours ago' },
    { id: 5, action: 'User role updated', user: 'admin', time: '3 hours ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Monitor your maintenance management system</p>
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
                  <p className="text-emerald-400 text-sm mt-1">{card.change} from last month</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                <div>
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-gray-400 text-sm">by {activity.user}</p>
                </div>
                <span className="text-gray-500 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;