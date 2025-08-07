import type { MenuItem, CreateOrderRequest } from '../types';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  note?: string;
}

export interface Cart {
  items: CartItem[];
  tableId?: number;
  orderType: 'PLACE' | 'TAKEAWAY' | 'DELIVERY';
  deliveryAddress?: string;
  deliveryTime?: string;
}

export const cartService = {
  calculateItemTotal: (item: CartItem): number => {
    return item.menuItem.price * item.quantity;
  },

  calculateCartTotal: (cart: Cart): number => {
    return cart.items.reduce((total, item) => total + cartService.calculateItemTotal(item), 0);
  },

  addToCart: (cart: Cart, menuItem: MenuItem, quantity: number = 1): Cart => {
    const existingItemIndex = cart.items.findIndex(
      item => item.menuItem.id === menuItem.id
    );

    if (existingItemIndex >= 0) {
      const newItems = [...cart.items];
      newItems[existingItemIndex].quantity += quantity;
      return { ...cart, items: newItems };
    }

    return {
      ...cart,
      items: [...cart.items, { menuItem, quantity }]
    };
  },

  removeFromCart: (cart: Cart, menuItemId: number): Cart => {
    return {
      ...cart,
      items: cart.items.filter(item => item.menuItem.id !== menuItemId)
    };
  },

  updateQuantity: (cart: Cart, menuItemId: number, quantity: number): Cart => {
    if (quantity <= 0) {
      return cartService.removeFromCart(cart, menuItemId);
    }

    const newItems = cart.items.map(item =>
      item.menuItem.id === menuItemId ? { ...item, quantity } : item
    );

    return { ...cart, items: newItems };
  },

  clearCart: (): Cart => ({
    items: [],
    orderType: 'PLACE'
  }),

  cartToOrderRequest: (cart: Cart, userId: number): CreateOrderRequest => ({
    userId,
    tableId: cart.tableId,
    orderType: cart.orderType,
    deliveryAddress: cart.deliveryAddress,
    deliveryTime: cart.deliveryTime,
    menuItems: cart.items.map(item => ({
      menuItemId: item.menuItem.id,
      quantity: item.quantity,
      price: item.menuItem.price
    }))
  })
};