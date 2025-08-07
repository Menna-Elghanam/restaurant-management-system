import React, { useState } from 'react';
import type { ReactNode } from 'react';
import  type { MenuItem } from '../types';
import { CartContext } from './cart-context-definition';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Array<{ menuItem: MenuItem; quantity: number }>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [orderType, setOrderType] = useState<'PLACE' | 'TAKEAWAY' | 'DELIVERY'>('PLACE');
  const [tableId, setTableId] = useState<number | undefined>();
  const [deliveryAddress, setDeliveryAddress] = useState<string | undefined>();

  const addItem = (menuItem: MenuItem, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.menuItem.id === menuItem.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { menuItem, quantity }];
    });
  };

  const removeItem = (menuItemId: number) => {
    setItems(prevItems => prevItems.filter(item => item.menuItem.id !== menuItemId));
  };

  const updateQuantity = (menuItemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.menuItem.id === menuItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setIsOpen(false);
    setTableId(undefined);
    setDeliveryAddress(undefined);
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const closeCart = () => {
    setIsOpen(false);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        orderType,
        tableId,
        deliveryAddress,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setOrderType,
        setTableId,
        setDeliveryAddress,
        toggleCart,
        closeCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};