// components/menu/create-menu-item-dialog.tsx
import React, { useState } from 'react';
import { useCategories, useCreateMenuItem } from '../hooks/use-menu';
import { validation } from '../utils/validation';
import { FormDialog } from '../components/form-dialog';
import { TextField, SelectField } from '../components/form-field';

interface MenuItemFormData {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  available: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
}

interface CreateMenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateMenuItemDialog: React.FC<CreateMenuItemDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { categories } = useCategories();
  const { createMenuItem, loading, error, clearError } = useCreateMenuItem();
  
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: '',
    description: '',
    price: '',
    categoryId: 'none',
    available: 'true',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const availabilityOptions = [
    { value: 'true', label: 'Available' },
    { value: 'false', label: 'Unavailable' },
  ];

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!validation.required(formData.name)) {
      errors.name = 'Name is required';
    }

    if (!validation.required(formData.description)) {
      errors.description = 'Description is required';
    }

    if (!validation.required(formData.price)) {
      errors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = 'Please enter a valid price greater than 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof MenuItemFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (['name', 'description', 'price'].includes(field)) {
      const errorField = field as keyof FormErrors;
      if (formErrors[errorField]) {
        setFormErrors(prev => ({ ...prev, [errorField]: undefined }));
      }
    }
    
    if (error) clearError();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createMenuItem({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        categoryId: formData.categoryId === 'none' ? undefined : Number(formData.categoryId),
        available: formData.available === 'true',
      });
      
      handleClose();
      onSuccess();
    } catch (error) {
      console.error('Failed to create menu item:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: 'none',
      available: 'true',
    });
    setFormErrors({});
    clearError();
    onOpenChange(false);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Menu Item"
      onSubmit={handleSubmit}
      onCancel={handleClose}
      submitLabel="Add Item"
      isLoading={loading}
      submitDisabled={!formData.name || !formData.description || !formData.price}
      error={error}
    >
      <TextField
        label="Item Name"
        value={formData.name}
        onChange={(value) => handleInputChange('name', value)}
        placeholder="Enter item name"
        error={formErrors.name}
        required
      />

      <TextField
        label="Description"
        value={formData.description}
        onChange={(value) => handleInputChange('description', value)}
        placeholder="Enter item description"
        error={formErrors.description}
        required
      />

      <TextField
        label="Price"
        value={formData.price}
        onChange={(value) => handleInputChange('price', value)}
        placeholder="0.00"
        type="number"
        error={formErrors.price}
        required
      />

      <SelectField
        label="Category"
        value={formData.categoryId}
        onChange={(value) => handleInputChange('categoryId', value)}
        options={[
          { value: 'none', label: 'No Category' },
          ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
        ]}
        placeholder="Select category"
      />

      <SelectField
        label="Availability"
        value={formData.available}
        onChange={(value) => handleInputChange('available', value)}
        options={availabilityOptions}
        placeholder="Select availability"
        required
      />
    </FormDialog>
  );
};