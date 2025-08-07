import { useState, useCallback } from 'react';

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default';
  icon?: React.ReactNode;
}

export const useConfirmationDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: '',
    description: '',
  });
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);

  const showConfirmation = useCallback((
    dialogOptions: ConfirmationOptions,
    confirmCallback: () => void
  ) => {
    setOptions(dialogOptions);
    setOnConfirm(() => confirmCallback);
    setIsOpen(true);
  }, []);

  const hideConfirmation = useCallback(() => {
    setIsOpen(false);
    setOnConfirm(null);
  }, []);

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }
    hideConfirmation();
  }, [onConfirm, hideConfirmation]);

  return {
    isOpen,
    options,
    showConfirmation,
    hideConfirmation,
    handleConfirm,
  };
};