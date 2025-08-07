import prisma from '../config/database.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const category = await prisma.category.create({
      data: { name, description },
    });

    res.status(201).json(
      ApiResponse.success(category, 'Category created successfully', 201)
    );
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        menuItems: {
          select: { id: true, name: true, price: true, available: true }
        }
      }
    });

    res.json(ApiResponse.success(categories, 'Categories retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { menuItems: true },
    });

    if (!category) {
      return res.status(404).json(
        ApiResponse.error('Category not found', 404)
      );
    }

    res.json(ApiResponse.success(category, 'Category retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name, description },
    });

    res.json(ApiResponse.success(updatedCategory, 'Category updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.json(ApiResponse.success(null, 'Category deleted successfully'));
  } catch (error) {
    next(error);
  }
};