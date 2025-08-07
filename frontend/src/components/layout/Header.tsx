import React from 'react';
import {  ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
// import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useCart } from '../../hooks/use-cart';

const Header: React.FC = () => {
  const { toggleCart, getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <header className="bg-white shadow-sm ">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center flex-1">
          {/* <div className="w-96">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search menu items, orders..."
                className="pl-10"
              />
            </div>
          </div> */}
        </div>

        <div className="flex items-center space-x-4">
          
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCart}
            className="relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0"
              >
                {itemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;