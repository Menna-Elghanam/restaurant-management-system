// pages/DashboardPage.tsx
import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  ChefHat, 
  ShoppingCart, 
  Calendar,
  AlertCircle,
  
  DollarSign,
  Plus,
  Eye,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/use-auth';
import { useOrders } from '../hooks/use-orders';
import { useMenuItems } from '../hooks/use-menu';
import { useTables } from '../hooks/use-tables';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { menuItems } = useMenuItems();
  const { tables } = useTables();

  // Calculate metrics
  const todayOrders = orders.filter(order => {
    const today = new Date().toDateString();
    return new Date(order.createdAt).toDateString() === today;
  });

  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = orders.filter(order => 
    ['pending', 'preparing'].includes(order.status)
  );
  const availableItems = menuItems.filter(item => item.available);
  const occupiedTables = tables.filter(table => table.status === 'Occupied');
  const freeTables = tables.filter(table => table.status === 'Free');

  // Quick stats
  const stats = [
    {
      title: "Today's Revenue",
      value: `$${todayRevenue.toFixed(2)}`,
      icon: DollarSign,
      trend: "+12.5%",
      trendUp: true,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Active Orders",
      value: activeOrders.length.toString(),
      icon: ShoppingCart,
      trend: `${todayOrders.length} today`,
      trendUp: true,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Table Occupancy",
      value: `${occupiedTables.length}/${tables.length}`,
      icon: Users,
      trend: `${Math.round((occupiedTables.length / tables.length) * 100)}%`,
      trendUp: occupiedTables.length > freeTables.length,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "Available Items",
      value: availableItems.length.toString(),
      icon: ChefHat,
      trend: `${menuItems.length} total`,
      trendUp: true,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
  ];

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { color: 'text-yellow-700', bg: 'bg-yellow-50', dot: 'bg-yellow-500' };
      case 'preparing': return { color: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' };
      case 'completed': return { color: 'text-green-700', bg: 'bg-green-50', dot: 'bg-green-500' };
      case 'cancelled': return { color: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' };
      default: return { color: 'text-gray-700', bg: 'bg-gray-50', dot: 'bg-gray-500' };
    }
  };

  const getTableStatusConfig = (status: string) => {
    switch (status) {
      case 'Free': return { color: 'text-green-700', bg: 'bg-green-50', dot: 'bg-green-500' };
      case 'Occupied': return { color: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' };
      case 'Reserved': return { color: 'text-yellow-700', bg: 'bg-yellow-50', dot: 'bg-yellow-500' };
      default: return { color: 'text-gray-700', bg: 'bg-gray-50', dot: 'bg-gray-500' };
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 min-h-screen">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getTimeGreeting()}, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening in your restaurant today
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border-l-4 hover:shadow-md transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm ${stat.trendUp ? 'text-green-600' : 'text-gray-500'}`}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Active Orders */}
        <Card className="lg:col-span-2 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Active Orders ({activeOrders.length})
              </CardTitle>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeOrders.length > 0 ? activeOrders.slice(0, 5).map(order => {
                const statusConfig = getStatusConfig(order.status);
                return (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${statusConfig.bg} rounded-full flex items-center justify-center`}>
                        <div className={`w-3 h-3 ${statusConfig.dot} rounded-full`}></div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Order #{order.id}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="capitalize">{order.orderType.toLowerCase()}</span>
                          {order.table && <span>• Table {order.table.number}</span>}
                          <span>• {order.orderItems.length} items</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No active orders</p>
                  <p className="text-sm text-gray-400 mt-1">Orders will appear here when they're placed</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-orange-600 hover:bg-orange-700 text-white">
                <Plus className="w-4 h-4 mr-3" />
                New Order
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-orange-50 hover:border-orange-200">
                <ChefHat className="w-4 h-4 mr-3" />
                Add Menu Item
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-orange-50 hover:border-orange-200">
                <Users className="w-4 h-4 mr-3" />
                Manage Tables
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-orange-50 hover:border-orange-200">
                <TrendingUp className="w-4 h-4 mr-3" />
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table Status */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Table Overview
              </CardTitle>
              <div className="text-sm text-gray-500">
                {occupiedTables.length} of {tables.length} occupied
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {tables.slice(0, 6).map(table => {
                const statusConfig = getTableStatusConfig(table.status);
                return (
                  <div key={table.id} className={`p-4 ${statusConfig.bg} border border-gray-200 rounded-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">Table {table.number}</span>
                      <div className={`w-3 h-3 ${statusConfig.dot} rounded-full`}></div>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{table.seats} seats</div>
                    <Badge variant="outline" className={`text-xs ${statusConfig.color}`}>
                      {table.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
            {tables.length > 6 && (
              <Button variant="ghost" className="w-full mt-4 text-orange-600 hover:text-orange-700">
                View All Tables
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Today's Summary */}
        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-white">Today's Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold">{todayOrders.length}</p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Average Order Value</p>
                  <p className="text-xl font-bold">
                    ${todayOrders.length > 0 ? (todayRevenue / todayOrders.length).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="pt-4 border-t border-white/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-100">Peak Hour</span>
                  <span className="font-semibold">12:00 - 1:00 PM</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for urgent items */}
      {activeOrders.filter(o => o.status === 'pending').length > 5 && (
        <Card className="mt-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">High Order Volume Alert</p>
                <p className="text-sm text-orange-600">
                  You have {activeOrders.filter(o => o.status === 'pending').length} pending orders. Consider prioritizing kitchen operations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;