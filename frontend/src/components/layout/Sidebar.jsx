import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Wrench, 
  ClipboardList,
  BarChart3, 
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/teams', icon: UserCheck, label: 'Teams' },
    { path: '/admin/equipment', icon: Wrench, label: 'Equipment' },
    { path: '/admin/maintenance', icon: ClipboardList, label: 'Maintenance Requests' }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-gray-800 border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">GearGuard</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-6 py-4 text-base font-medium transition-colors cursor-pointer ${
                  active 
                    ? 'text-emerald-400 bg-emerald-900/20 border-r-2 border-emerald-400' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Icon className="w-6 h-6 mr-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;