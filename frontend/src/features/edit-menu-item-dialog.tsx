// components/menu/edit-menu-item-dialog.tsx
import React, { useState, useEffect } from 'react';
import { useCategories, useUpdateMenuItem } from '../hooks/use-menu';
import { validation } from '../utils/validation';
import { FormDialog } from '../components/form-dialog';
import { TextField, SelectField } from '../components/form-field';
import type { MenuItem } from '../types';

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

interface EditMenuItemDialogProps {
  item: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditMenuItemDialog: React.FC<EditMenuItemDialogProps> = ({
  item,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { categories } = useCategories();
  const { updateMenuItem, loading, error, clearError } = useUpdateMenuItem();
  
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

  // Initialize form when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        categoryId: item.categoryId?.toString() || 'none',
        available: item.available.toString(),
      });
      setFormErrors({});
      clearError();
    }
  }, [item, clearError]);

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

  type FormErrorField = keyof FormErrors;

  const handleInputChange = (field: keyof MenuItemFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Only clear error if the field is a FormErrors key
    if ((['name', 'description', 'price'] as FormErrorField[]).includes(field as FormErrorField)) {
      const errorField = field as FormErrorField;
      if (formErrors[errorField]) {
        setFormErrors(prev => ({ ...prev, [errorField]: undefined }));
      }
    }

    if (error) clearError();
  };

  const handleSubmit = async () => {
    if (!validateForm() || !item) return;

    try {
      await updateMenuItem(item.id, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        categoryId: formData.categoryId === 'none' ? undefined : Number(formData.categoryId),
        available: formData.available === 'true',
      });
      
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Failed to update menu item:', error);
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Menu Item"
      onSubmit={handleSubmit}
      onCancel={() => onOpenChange(false)}
      submitLabel="Update Item"
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