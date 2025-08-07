import React, { useState } from 'react';
import { Plus, Users, AlertTriangle } from 'lucide-react';
import { useTables, useCreateTable } from '../hooks/use-tables';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { FormDialog } from '../components/form-dialog';
import { TextField, SelectField } from '../components/form-field';

interface TableStatusConfig {
  color: string;
  dotColor: string;
}

const STATUS_CONFIG: Record<string, TableStatusConfig> = {
  'Free': { 
    color: 'text-green-700', 
    dotColor: 'bg-green-500'
  },
  'Occupied': { 
    color: 'text-red-700', 
    dotColor: 'bg-red-500'
  },
  'Reserved': { 
    color: 'text-yellow-700', 
    dotColor: 'bg-yellow-500'
  },
  'Out of Order': { 
    color: 'text-gray-700', 
    dotColor: 'bg-gray-500'
  },
};

const STATUS_OPTIONS = [
  { value: 'Free', label: 'Free' },
  { value: 'Occupied', label: 'Occupied' },
  { value: 'Reserved', label: 'Reserved' },
  { value: 'Out of Order', label: 'Out of Order' },
];

interface AddTableFormData {
  number: string;
  seats: string;
  status: string;
}

const TablesPage: React.FC = () => {
  const { tables, loading, error, refetch } = useTables();
  const { createTable, loading: createLoading, error: createError, clearError } = useCreateTable();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState<AddTableFormData>({
    number: '',
    seats: '',
    status: 'Free'
  });
  const [formErrors, setFormErrors] = useState<Partial<AddTableFormData>>({});

  const getStatusConfig = (status: string): TableStatusConfig => {
    return STATUS_CONFIG[status] || STATUS_CONFIG['Free'];
  };

  const validateForm = (): boolean => {
    const errors: Partial<AddTableFormData> = {};

    if (!formData.number.trim()) {
      errors.number = 'Table number is required';
    } else if (isNaN(Number(formData.number)) || Number(formData.number) <= 0) {
      errors.number = 'Please enter a valid table number';
    } else if (tables.some(table => table.number === Number(formData.number))) {
      errors.number = 'Table number already exists';
    }

    if (!formData.seats.trim()) {
      errors.seats = 'Number of seats is required';
    } else if (isNaN(Number(formData.seats)) || Number(formData.seats) <= 0) {
      errors.seats = 'Please enter a valid number of seats';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof AddTableFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (createError) {
      clearError();
    }
  };

  const handleAddTable = async () => {
    if (!validateForm()) return;

    try {
      await createTable({
        number: Number(formData.number),
        seats: Number(formData.seats),
        status: formData.status as 'Free' | 'Occupied' | 'Reserved' | 'Out of Order'
      });
      
      handleCloseDialog();
      await refetch();
    } catch (error) {
      console.error('Failed to create table:', error);
    }
  };

  const handleOpenDialog = () => {
    setFormData({ number: '', seats: '', status: 'Free' });
    setFormErrors({});
    clearError();
    setShowAddDialog(true);
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setFormData({ number: '', seats: '', status: 'Free' });
    setFormErrors({});
    clearError();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md bg-white rounded-lg shadow-lg border p-8">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading tables</h3>
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tables</h1>
          <p className="text-gray-600 text-sm mt-1">Manage restaurant tables</p>
        </div>
        <Button 
          onClick={handleOpenDialog}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Table
        </Button>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="bg-white shadow-sm">
              <CardContent className="p-4">
                <Skeleton className="h-4 w-16 mb-3" />
                <Skeleton className="h-8 w-12 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          tables.map((table) => {
            const statusConfig = getStatusConfig(table.status);
            
            return (
              <Card key={table.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md">
                <CardContent className="p-4">
                  {/* Status */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 ${statusConfig.dotColor} rounded-full`}></div>
                    <span className={`text-xs font-medium ${statusConfig.color}`}>
                      {table.status}
                    </span>
                  </div>

                  {/* Table Number */}
                  <div className="mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Table {table.number}
                    </h3>
                  </div>

                  {/* Seats */}
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{table.seats} seats</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Empty State */}
      {!loading && tables.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tables found</h3>
          <p className="text-gray-500 mb-4">Add your first table to get started</p>
          <Button 
            onClick={handleOpenDialog}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Table
          </Button>
        </div>
      )}

      {/* Add Table Dialog */}
      <FormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        title="Add New Table"
        onSubmit={handleAddTable}
        onCancel={handleCloseDialog}
        submitLabel="Add Table"
        isLoading={createLoading}
        submitDisabled={!formData.number || !formData.seats}
        error={createError}
      >
        <TextField
          label="Table Number"
          value={formData.number}
          onChange={(value) => handleInputChange('number', value)}
          placeholder="Enter table number"
          type="number"
          error={formErrors.number}
          required
        />

        <TextField
          label="Number of Seats"
          value={formData.seats}
          onChange={(value) => handleInputChange('seats', value)}
          placeholder="Enter number of seats"
          type="number"
          error={formErrors.seats}
          required
        />

        <SelectField
          label="Status"
          value={formData.status}
          onChange={(value) => handleInputChange('status', value)}
          options={STATUS_OPTIONS}
          placeholder="Select status"
        />
      </FormDialog>
    </div>
  );
};

export default TablesPage;