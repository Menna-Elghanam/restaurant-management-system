import React, { useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../../hooks/use-cart';
import { useCreateOrder } from '../../hooks/use-orders';
import { useTables } from '../../hooks/use-tables';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

const CartSidebar: React.FC = () => {
  const {
    isOpen,
    items,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotal,
    orderType,
    setOrderType,
    tableId,
    setTableId,
    deliveryAddress,
    setDeliveryAddress
  } = useCart();

  const { createOrder, loading: isCreating } = useCreateOrder();
  const { tables, refetch: refetchTables } = useTables();

  // ✅ SIMPLE FIX: Refresh tables when cart opens
  useEffect(() => {
    if (isOpen) {
      refetchTables();
    }
  }, [isOpen, refetchTables]);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    try {
      if (items.length === 0) {
        toast.error('Cart is empty');
        return;
      }

      // Validate based on order type
      if (orderType === 'PLACE' && !tableId) {
        toast.error('Please select a table for dine-in orders');
        return;
      }

      if (orderType === 'DELIVERY' && (!deliveryAddress || deliveryAddress.trim() === '')) {
        toast.error('Please enter a delivery address');
        return;
      }

      const orderData = {
        userId: 0, // This will be set by the hook with current user's ID
        tableId: orderType === 'PLACE' ? tableId : undefined,
        orderType,
        deliveryAddress: orderType === 'DELIVERY' ? deliveryAddress : undefined,
        deliveryTime: undefined,
        menuItems: items.map(item => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          price: item.menuItem.price
        }))
      };

      await createOrder(orderData);
      toast.success('Order created successfully!');
      
      clearCart();
      closeCart();
    } catch (error) {
      console.error('Failed to create order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
      toast.error(errorMessage);
    }
  };

  // Filter only FREE tables
  const availableTables = tables?.filter(table => table.status === 'Free') || [];

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={closeCart} />
      
      <div className="relative ml-auto w-96 bg-white shadow-xl flex flex-col max-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            Cart ({items.length} item{items.length !== 1 ? 's' : ''})
          </h2>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
            <ShoppingCart className="w-12 h-12 mb-4" />
            <p>Your cart is empty</p>
            <p className="text-sm">Add some delicious items!</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.menuItem.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.menuItem.name}</h3>
                      <p className="text-sm text-gray-500">
                        ${item.menuItem.price.toFixed(2)} each
                      </p>
                      <p className="text-xs text-gray-600">
                        Subtotal: ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => removeItem(item.menuItem.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Order Configuration */}
            <div className="p-4 border-t space-y-4 bg-gray-50">
              {/* Order Type Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Order Type</Label>
                <div className="flex space-x-2 mt-2">
                  {(['PLACE', 'TAKEAWAY', 'DELIVERY'] as const).map((type) => (
                    <Button
                      key={type}
                      variant={orderType === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setOrderType(type);
                        // ✅ Reset table selection when changing order type
                        if (type !== 'PLACE') {
                          setTableId(0);
                        }
                      }}
                      className="flex-1"
                    >
                      {type === 'PLACE' ? 'Dine In' : 
                       type === 'TAKEAWAY' ? 'Takeaway' : 'Delivery'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Table Selection for Dine-in Orders */}
              {orderType === 'PLACE' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Select Table</Label>
                  
                  <Select 
                    value={tableId?.toString() || ''} 
                    onValueChange={(value) => {
                      if (value && value !== "no-tables") {
                        setTableId(Number(value));
                      }
                    }}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose an available table" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTables.length > 0 ? (
                        availableTables.map((table) => (
                          <SelectItem key={table.id} value={table.id.toString()}>
                            Table {table.number} ({table.seats} seats)
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-tables" disabled>
                          No tables available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  
                  {orderType === 'PLACE' && !tableId && (
                    <p className="text-xs text-red-500 mt-1">Please select a table</p>
                  )}
                </div>
              )}

              {/* Delivery Address for Delivery Orders */}
              {orderType === 'DELIVERY' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Delivery Address</Label>
                  <Input
                    placeholder="Enter complete delivery address..."
                    value={deliveryAddress || ''}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="mt-2"
                  />
                  {orderType === 'DELIVERY' && (!deliveryAddress || deliveryAddress.trim() === '') && (
                    <p className="text-xs text-red-500 mt-1">Please enter delivery address</p>
                  )}
                </div>
              )}

              <Separator />
              
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total:</span>
                <span className="font-bold text-xl text-green-600">${getTotal().toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full"
                onClick={handleCheckout}
                disabled={isCreating || items.length === 0}
                size="lg"
              >
                {isCreating ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Order...
                  </span>
                ) : (
                  `Place Order - $${getTotal().toFixed(2)}`
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;