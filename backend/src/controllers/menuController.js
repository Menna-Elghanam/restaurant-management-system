import prisma from '../config/database.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, categoryId, available = true } = req.body;

    const newMenuItem = await prisma.menuItem.create({
      data: { name, description, price, categoryId, available },
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    });

    res.status(201).json(
      ApiResponse.success(newMenuItem, 'Menu item created successfully', 201)
    );
  } catch (error) {
    next(error);
  }
};

export const getAllMenuItems = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, categoryId, available, search } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    
    if (categoryId) where.categoryId = parseInt(categoryId);
    if (available !== undefined) where.available = available === 'true';
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [menuItems, total] = await Promise.all([
      prisma.menuItem.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.menuItem.count({ where })
    ]);

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    };

    res.json(
      ApiResponse.paginated(menuItems, pagination, 'Menu items retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    });

    if (!menuItem) {
      return res.status(404).json(
        ApiResponse.error('Menu item not found', 404)
      );
    }

    res.json(ApiResponse.success(menuItem, 'Menu item retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId, available } = req.body;

    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: { name, description, price, categoryId, available },
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    });

    res.json(ApiResponse.success(updatedMenuItem, 'Menu item updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.menuItem.delete({
      where: { id: parseInt(id) },
    });

    res.json(ApiResponse.success(null, 'Menu item deleted successfully'));
  } catch (error) {
    next(error);
  }
};