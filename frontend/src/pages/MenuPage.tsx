import React, { useState } from 'react';
import { Plus, Search, AlertTriangle, DollarSign, Tag, ChefHat, Edit, Trash2 } from 'lucide-react';
import { useMenuItems, useCategories } from '../hooks/use-menu';
import { useCart } from '../hooks/use-cart';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { SelectField } from '../components/form-field';
import { CreateMenuItemDialog } from '../features/create-menu-item-dialog';
import { EditMenuItemDialog } from '../features/edit-menu-item-dialog';
import { DeleteMenuItemDialog } from '../features/delete-menu-item-dialog';
import type { MenuItem } from '../types';

const MenuPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);

  const { menuItems, loading, error, refetch } = useMenuItems({
    search: searchTerm,
    categoryId: categoryFilter === 'all' ? undefined : Number(categoryFilter),
  });
  const { categories } = useCategories();
  const { addItem } = useCart(); // Added cart functionality

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
  ];

  const handleSuccess = () => {
    refetch();
  };

  // Added cart handler
  const handleAddToCart = (menuItem: MenuItem) => {
    addItem(menuItem);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md bg-white rounded-lg shadow-lg border p-8">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading menu</h3>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Menu Management</h1>
            <p className="text-gray-600 text-sm mt-1">Manage your restaurant's menu items</p>
          </div>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Menu Item
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="mb-6 bg-white shadow-sm border-0">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 h-10"
                />
              </div>
            </div>
            
            <div className="w-full sm:w-48">
              <SelectField
                label=""
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={categoryOptions}
                placeholder="Filter by category"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="bg-white shadow-sm border-0">
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full mb-4 rounded-lg" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : menuItems.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || (categoryFilter !== 'all') ? 'No menu items found' : 'No menu items yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || (categoryFilter !== 'all') ? 'Try adjusting your search or filters' : 'Add your first menu item to get started'}
            </p>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </div>
        ) : (
          menuItems.map((item) => (
            <Card 
              key={item.id} 
              className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200 group"
            >
              <CardContent className="p-0">
                {/* Item Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center rounded-t-lg">
                </div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Header with Actions */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                        {item.name}
                      </h3>
                      {item.category && (
                        <div className="flex items-center gap-1 mt-1">
                          <Tag className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{item.category.name}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Management Actions - Always visible for admin */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingItem(item)}
                        className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-700"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDeletingItem(item)}
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[2.5rem]">
                    {item.description}
                  </p>

                  {/* Price and Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-xl font-bold text-gray-900">
                        {item.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <Badge 
                        variant={item.available ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {item.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                  </div>

                  {/* Add order Button - Only show if available */}
                  {item.available && (
                    <Button 
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      size="sm"
                    >
                      Place order
                    </Button>
                  )}

                  {/* Unavailable State */}
                  {!item.available && (
                    <Button 
                      disabled
                      className="w-full"
                      variant="outline"
                      size="sm"
                    >
                      Currently Unavailable
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialogs */}
      <CreateMenuItemDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleSuccess}
      />

      <EditMenuItemDialog
        item={editingItem}
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
        onSuccess={handleSuccess}
      />

      <DeleteMenuItemDialog
        item={deletingItem}
        open={!!deletingItem}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default MenuPage;