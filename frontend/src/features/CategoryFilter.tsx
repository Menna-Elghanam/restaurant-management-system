import React from 'react';
import type { Category } from '../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: number | undefined;
  onCategoryChange: (categoryId: number | undefined) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <Select
      value={selectedCategory?.toString() || 'all'}
      onValueChange={(value) => onCategoryChange(value === 'all' ? undefined : Number(value))}
    >
      <SelectTrigger className="w-48">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id.toString()}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryFilter;