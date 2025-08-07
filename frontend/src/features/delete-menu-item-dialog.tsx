// components/menu/delete-menu-item-dialog.tsx
import React from 'react';
import { useDeleteMenuItem } from '../hooks/use-menu';
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
import type { MenuItem } from '../types';

interface DeleteMenuItemDialogProps {
  item: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const DeleteMenuItemDialog: React.FC<DeleteMenuItemDialogProps> = ({
  item,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { deleteMenuItem, loading } = useDeleteMenuItem();

  const handleDelete = async () => {
    if (!item) return;

    try {
      await deleteMenuItem(item.id);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Failed to delete menu item:', error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{item?.name}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </div>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};