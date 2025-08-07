// pages/OrdersPage.tsx
import React, { useState } from 'react';
import { Search, FileText, AlertTriangle, Calendar, ShoppingCart } from 'lucide-react';
import { useOrders } from '../hooks/use-orders';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { CreateInvoiceDialog } from '../features/CreateInvoiceDialog';

interface OrderStatusConfig {
  color: string;
  dotColor: string;
  badgeVariant: 'default' | 'destructive' | 'secondary' | 'outline';
}

const STATUS_CONFIG: Record<string, OrderStatusConfig> = {
  'completed': {
    color: 'text-green-700',
    dotColor: 'bg-green-500',
    badgeVariant: 'default'
  },
  'preparing': {
    color: 'text-blue-700',
    dotColor: 'bg-blue-500',
    badgeVariant: 'secondary'
  },
  'pending': {
    color: 'text-yellow-700',
    dotColor: 'bg-yellow-500',
    badgeVariant: 'outline'
  },
  'cancelled': {
    color: 'text-red-700',
    dotColor: 'bg-red-500',
    badgeVariant: 'destructive'
  },
};

const OrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [invoiceOrderId, setInvoiceOrderId] = useState<number | null>(null);
  
  const { orders, loading, error, refetch } = useOrders();

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().includes(searchTerm) ||
                         order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string): OrderStatusConfig => {
    return STATUS_CONFIG[status] || STATUS_CONFIG['pending'];
  };

  const selectedOrder = orders.find(order => order.id === invoiceOrderId);

  const handleCreateInvoice = (orderId: number) => {
    setInvoiceOrderId(orderId);
  };

  const handleInvoiceSuccess = () => {
    refetch();
    setInvoiceOrderId(null);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md bg-white rounded-lg shadow-lg border p-8">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading orders</h3>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="text-gray-600 text-sm mt-1">Manage restaurant orders and create invoices</p>
      </div>

      {/* Search & Filters */}
      <Card className="mb-6 bg-white shadow-sm border-0">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by order ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 h-10"
                />
              </div>
            </div>
            
            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-white shadow-sm border-0">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8">
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No orders found' : 'No orders yet'}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Orders will appear here when customers place them'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gray-50/50">
                    <TableHead className="h-12 px-6 text-left align-middle font-medium text-gray-700">
                      Order
                    </TableHead>
                    <TableHead className="h-12 px-6 text-left align-middle font-medium text-gray-700">
                      Customer
                    </TableHead>
                    <TableHead className="h-12 px-6 text-left align-middle font-medium text-gray-700">
                      Type
                    </TableHead>
                    <TableHead className="h-12 px-6 text-left align-middle font-medium text-gray-700">
                      Details
                    </TableHead>
                    <TableHead className="h-12 px-6 text-left align-middle font-medium text-gray-700">
                      Total
                    </TableHead>
                    <TableHead className="h-12 px-6 text-left align-middle font-medium text-gray-700">
                      Status
                    </TableHead>
                    <TableHead className="h-12 px-6 text-left align-middle font-medium text-gray-700">
                      Date
                    </TableHead>
                    <TableHead className="h-12 px-6 text-right align-middle font-medium text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    
                    return (
                      <TableRow 
                        key={order.id} 
                        className="border-b border-gray-100 hover:bg-gray-50/50"
                      >
                        <TableCell className="h-16 px-6 align-middle">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">#{order.id}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell className="h-16 px-6 align-middle">
                          <div>
                            <div className="font-medium text-gray-900">{order.user.name}</div>
                            <div className="text-sm text-gray-500">{order.user.email}</div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="h-16 px-6 align-middle">
                          <Badge variant="outline" className="capitalize">
                            {order.orderType.toLowerCase()}
                          </Badge>
                        </TableCell>
                        
                        <TableCell className="h-16 px-6 align-middle">
                          <div>
                            <div className="font-medium text-gray-900">{order.orderItems.length} items</div>
                            {order.table && (
                              <div className="text-sm text-gray-500">Table {order.table.number}</div>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell className="h-16 px-6 align-middle">
                          <div className="font-semibold text-gray-900">
                            ${order.total.toFixed(2)}
                          </div>
                        </TableCell>
                        
                        <TableCell className="h-16 px-6 align-middle">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 ${statusConfig.dotColor} rounded-full`}></div>
                            <Badge 
                              variant={statusConfig.badgeVariant}
                              className={`${statusConfig.color} font-medium capitalize`}
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </TableCell>
                        
                        <TableCell className="h-16 px-6 align-middle">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell className="h-16 px-6 align-middle text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCreateInvoice(order.id)}
                              disabled={order.status === 'cancelled'}
                              className="hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700"
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Invoice
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Invoice Dialog */}
      {selectedOrder && (
        <CreateInvoiceDialog
          open={!!invoiceOrderId}
          onOpenChange={(open) => !open && setInvoiceOrderId(null)}
          order={selectedOrder}
          onSuccess={handleInvoiceSuccess}
        />
      )}
    </div>
  );
};

export default OrdersPage;