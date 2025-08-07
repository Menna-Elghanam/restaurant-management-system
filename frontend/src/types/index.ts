export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  menuItems?: MenuItem[];
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  categoryId?: number;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  price: number;
  menuItem: MenuItem;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  userId: number;
  tableId?: number;
  total: number;
  status: string;
  orderType: 'PLACE' | 'TAKEAWAY' | 'DELIVERY';
  deliveryAddress?: string;
  deliveryTime?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  table?: Table;
  orderItems: OrderItem[];
}

export interface Table {
  id: number;
  number: number;
  seats: number;
  status: 'Free' | 'Occupied' | 'Reserved' | 'Out of Order';
  orders?: Order[];
}

export interface Invoice {
  id: number;
  orderId: number;
  billingName: string;
  billingAddress: string;
  billingEmail: string;
  billingPhone: string;
  totalAmount: number;
  status: 'unpaid' | 'paid' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  order: Order;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  timestamp: string;
}

export interface CreateOrderRequest {
  userId: number;
  tableId?: number;
  orderType: 'PLACE' | 'TAKEAWAY' | 'DELIVERY';
  deliveryAddress?: string;
  deliveryTime?: string;
  menuItems: {
    menuItemId: number;
    quantity: number;
    price: number;
  }[];
}

export interface SalesData {
  totalSales: number;
}

export interface DailySales {
  date: string;
  totalSales: number;
}

export interface TableSales {
  tableNumber: number;
  totalSales: number;
}



export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshAuth: () => Promise<void>;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}