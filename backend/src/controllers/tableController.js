import prisma from '../config/database.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const createTable = async (req, res, next) => {
  try {
    const { number, seats, status = "Free" } = req.body;

    const newTable = await prisma.table.create({
      data: { number, seats, status },
    });

    res.status(201).json(
      ApiResponse.success(newTable, 'Table created successfully', 201)
    );
  } catch (error) {
    next(error);
  }
};
export const getAllTables = async (req, res, next) => {
  try {
    const tables = await prisma.table.findMany({
      include: {
        orders: {
          where: {
            orderType: {
              in: ['PLACE', 'TAKEAWAY', 'DELIVERY']
            }
          },
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true }
            },
            orderItems: {
              include: {
                menuItem: {
                  select: { id: true, name: true, price: true, description: true }
                }
              }
            }
          }
        }
      }
    });

    res.json(ApiResponse.success(tables, 'Tables retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getTableById = async (req, res, next) => {
  try {
    const { tableId } = req.params;

    const table = await prisma.table.findUnique({
      where: { id: parseInt(tableId) },
      include: {
        orders: {
          where: {
            orderType: {
              in: ['PLACE', 'TAKEAWAY', 'DELIVERY']
            }
          },
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true }
            },
            orderItems: {
              include: {
                menuItem: {
                  select: { id: true, name: true, price: true, description: true }
                }
              }
            }
          }
        }
      }
    });

    if (!table) {
      return res.status(404).json(
        ApiResponse.error('Table not found', 404)
      );
    }

    res.json(ApiResponse.success(table, 'Table retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateTable = async (req, res, next) => {
  try {
    const { tableId } = req.params;
    const { number, seats, status } = req.body;

    const updatedTable = await prisma.table.update({
      where: { id: parseInt(tableId) },
      data: { number, seats, status },
    });

    res.json(ApiResponse.success(updatedTable, 'Table updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteTable = async (req, res, next) => {
  try {
    const { tableId } = req.params;

    await prisma.table.delete({
      where: { id: parseInt(tableId) },
    });

    res.json(ApiResponse.success(null, 'Table deleted successfully'));
  } catch (error) {
    next(error);
  }
};