// components/invoices/create-invoice-dialog.tsx
import React, { useState, useEffect } from 'react';
import { useCreateInvoice } from '../hooks/use-invoices';
import { validation } from '../utils/validation';
import { FormDialog } from '../components/form-dialog';
import { TextField } from '../components/form-field';
import type { Order } from '../types';

interface InvoiceFormData {
  billingName: string;
  billingAddress: string;
  billingEmail: string;
  billingPhone: string;
}

interface FormErrors {
  billingName?: string;
  billingAddress?: string;
  billingEmail?: string;
  billingPhone?: string;
}

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
  onSuccess: () => void;
}

export const CreateInvoiceDialog: React.FC<CreateInvoiceDialogProps> = ({
  open,
  onOpenChange,
  order,
  onSuccess,
}) => {
  const { createInvoice, loading, error, clearError } = useCreateInvoice();
  const [formData, setFormData] = useState<InvoiceFormData>({
    billingName: '',
    billingAddress: '',
    billingEmail: '',
    billingPhone: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Initialize form with order data when dialog opens
  useEffect(() => {
    if (open && order) {
      setFormData({
        billingName: order.user.name || '',
        billingAddress: order.deliveryAddress || '',
        billingEmail: order.user.email || '',
        billingPhone: '',
      });
      setFormErrors({});
      clearError();
    }
  }, [open, order, clearError]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Billing Name validation
    if (!validation.required(formData.billingName)) {
      errors.billingName = 'Customer name is required';
    }

    // Email validation
    if (!validation.required(formData.billingEmail)) {
      errors.billingEmail = 'Email address is required';
    } else if (!validation.email(formData.billingEmail)) {
      errors.billingEmail = 'Please enter a valid email address';
    }

    // Phone validation
    if (!validation.required(formData.billingPhone)) {
      errors.billingPhone = 'Phone number is required';
    } else if (!validation.phone(formData.billingPhone)) {
      errors.billingPhone = 'Please enter a valid phone number';
    }

    // Address validation
    if (!validation.required(formData.billingAddress)) {
      errors.billingAddress = 'Billing address is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof InvoiceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear API error when user makes changes
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createInvoice({
        orderId: order.id,
        ...formData,
      });
      
      handleCancel();
      onSuccess();
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      billingName: '',
      billingAddress: '',
      billingEmail: '',
      billingPhone: '',
    });
    setFormErrors({});
    clearError();
    onOpenChange(false);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Create Invoice - Order #${order.id}`}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitLabel="Create Invoice"
      isLoading={loading}
      submitDisabled={!formData.billingName || !formData.billingEmail || !formData.billingPhone || !formData.billingAddress}
      error={error}
    >
      {/* Order Summary */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
        <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Order Total:</span>
            <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Items:</span>
            <span className="text-gray-900">{order.orderItems.length} items</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order Type:</span>
            <span className="text-gray-900 capitalize">{order.orderType.toLowerCase()}</span>
          </div>
          {order.table && (
            <div className="flex justify-between">
              <span className="text-gray-600">Table:</span>
              <span className="text-gray-900">Table {order.table.number}</span>
            </div>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <TextField
        label="Customer Name"
        value={formData.billingName}
        onChange={(value) => handleInputChange('billingName', value)}
        placeholder="Enter customer name"
        error={formErrors.billingName}
        required
      />

      <TextField
        label="Email Address"
        value={formData.billingEmail}
        onChange={(value) => handleInputChange('billingEmail', value)}
        placeholder="customer@email.com"
        type="email"
        error={formErrors.billingEmail}
        required
      />

      <TextField
        label="Phone Number"
        value={formData.billingPhone}
        onChange={(value) => handleInputChange('billingPhone', value)}
        placeholder="+1 (555) 123-4567"
        error={formErrors.billingPhone}
        required
      />

      <TextField
        label="Billing Address"
        value={formData.billingAddress}
        onChange={(value) => handleInputChange('billingAddress', value)}
        placeholder="Enter billing address"
        error={formErrors.billingAddress}
        required
      />
    </FormDialog>
  );
};