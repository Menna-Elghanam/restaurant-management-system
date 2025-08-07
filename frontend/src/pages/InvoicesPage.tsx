// pages/InvoicesPage.tsx
import React, { useState } from 'react';
import { Search,  CreditCard, AlertTriangle, CheckCircle, DollarSign, Calendar } from 'lucide-react';
import { useInvoices, useUpdateInvoiceStatus } from '../hooks/use-invoices';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

interface InvoiceStatusConfig {
  color: string;
  bgColor: string;
  dotColor: string;
  badgeVariant: 'default' | 'destructive' | 'secondary' | 'outline';
}

const STATUS_CONFIG: Record<string, InvoiceStatusConfig> = {
  'paid': {
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    dotColor: 'bg-green-500',
    badgeVariant: 'default'
  },
  'unpaid': {
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    dotColor: 'bg-red-500',
    badgeVariant: 'destructive'
  },
  'cancelled': {
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    dotColor: 'bg-gray-500',
    badgeVariant: 'secondary'
  },
};

const InvoicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [payInvoiceId, setPayInvoiceId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  
  const { invoices, loading, error, refetch } = useInvoices();
  const { updateInvoiceStatus, loading: updateLoading } = useUpdateInvoiceStatus();

  const filteredInvoices = invoices.filter(invoice => 
    invoice.id.toString().includes(searchTerm) ||
    invoice.billingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.billingEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusConfig = (status: string): InvoiceStatusConfig => {
    return STATUS_CONFIG[status] || STATUS_CONFIG['unpaid'];
  };

  const handleMarkAsPaid = async (invoiceId: number) => {
    try {
      setActionLoading(invoiceId);
      await updateInvoiceStatus(invoiceId, 'paid');
      await refetch();
      setPayInvoiceId(null);
    } catch (error) {
      console.error('Failed to mark invoice as paid:', error);
    } finally {
      setActionLoading(null);
    }
  };

 

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md bg-white rounded-lg shadow-lg border p-8">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading invoices</h3>
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
        <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
        <p className="text-gray-600 text-sm mt-1">Manage customer invoices and payments</p>
      </div>

      {/* Search */}
      <Card className="mb-6 bg-white shadow-sm border-0">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by ID, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 h-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
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
                      <Skeleton className="h-4 w-40" />
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
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No invoices found' : 'No invoices yet'}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Invoices will appear here when orders are created'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gray-50/50">
                    <TableHead className="h-12 px-6 text-left align-middle font-medium text-gray-700">
                      Invoice
                    </TableHead>
                    <TableHead className="h-12 px-6 text-left align-middle font-medium text-gray-700">
                      Customer
                    </TableHead>
                    <TableHead className="h-12 px-6 text-left align-middle font-medium text-gray-700">
                      Contact
                    </TableHead>
                    <TableHead className="h-12 px-6 text-left align-middle font-medium text-gray-700">
                      Amount
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
                  {filteredInvoices.map((invoice) => {
                    const statusConfig = getStatusConfig(invoice.status);
                    const isActionLoading = actionLoading === invoice.id;
                    
                    return (
                      <TableRow 
                        key={invoice.id} 
                        className="border-b border-gray-100 hover:bg-gray-50/50"
                      >
                        <TableCell className="h-16 px-6 align-middle">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">#{invoice.id}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell className="h-16 px-6 align-middle">
                          <div>
                            <div className="font-medium text-gray-900">{invoice.billingName}</div>
                            <div className="text-sm text-gray-500">{invoice.order?.user?.name || 'N/A'}</div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="h-16 px-6 align-middle">
                          <div>
                            <div className="text-sm text-gray-900">{invoice.billingEmail}</div>
                            <div className="text-sm text-gray-500">{invoice.billingPhone}</div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="h-16 px-6 align-middle">
                          <div className="font-semibold text-gray-900">
                            ${invoice.totalAmount.toFixed(2)}
                          </div>
                        </TableCell>
                        
                        <TableCell className="h-16 px-6 align-middle">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 ${statusConfig.dotColor} rounded-full`}></div>
                            <Badge 
                              variant={statusConfig.badgeVariant}
                              className={`${statusConfig.color} font-medium capitalize`}
                            >
                              {invoice.status}
                            </Badge>
                          </div>
                        </TableCell>
                        
                        <TableCell className="h-16 px-6 align-middle">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(invoice.createdAt).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell className="h-16 px-6 align-middle text-right">
                          <div className="flex items-center justify-end gap-2">
                         
                            {invoice.status === 'unpaid' && (
                              <Button
                                size="sm"
                                onClick={() => setPayInvoiceId(invoice.id)}
                                disabled={isActionLoading}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                {isActionLoading ? (
                                  <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Processing...</span>
                                  </div>
                                ) : (
                                  <>
                                    <CreditCard className="w-4 h-4 mr-1" />
                                    Mark Paid
                                  </>
                                )}
                              </Button>
                            )}

                            {invoice.status === 'paid' && (
                              <div className="flex items-center gap-1 text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                                <CheckCircle className="w-3 h-3" />
                                Paid
                              </div>
                            )}
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

      {/* Mark as Paid Confirmation Dialog */}
      <AlertDialog open={payInvoiceId !== null} onOpenChange={() => setPayInvoiceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark Invoice as Paid</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this invoice as paid? This action will update the payment status and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => payInvoiceId && handleMarkAsPaid(payInvoiceId)}
              disabled={updateLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {updateLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                'Mark as Paid'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoicesPage;