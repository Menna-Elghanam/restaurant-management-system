import { createContext } from 'react';
import type { MenuItem } from '../types';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  orderType: 'PLACE' | 'TAKEAWAY' | 'DELIVERY';
  tableId?: number;
  deliveryAddress?: string;
  addItem: (menuItem: MenuItem, quantity?: number) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  setOrderType: (type: 'PLACE' | 'TAKEAWAY' | 'DELIVERY') => void;
  setTableId: (id: number) => void;
  setDeliveryAddress: (address: string) => void;
  toggleCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);