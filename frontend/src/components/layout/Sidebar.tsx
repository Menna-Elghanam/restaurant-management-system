import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Menu, 
  ShoppingCart, 
  Users, 
  FileText, 
  BarChart3,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/use-auth';
import { Button } from '../ui/button';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Menu', href: '/menu', icon: Menu },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Tables', href: '/tables', icon: Users },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Sales', href: '/sales', icon: BarChart3, adminOnly: true },
  ];

  const filteredNavigation = navigation.filter(
    item => !item.adminOnly || user?.role === 'ADMIN'
  );

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 px-4">
        <h1 className="text-xl font-bold text-gray-900">Restaurant POS</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="w-full justify-start"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;