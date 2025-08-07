import prisma from '../config/database.js';
import { ApiResponse } from '../utils/apiResponse.js';

// Get total sales for a date range
export const getTotalSales = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;

    const totalSales = await prisma.invoice.aggregate({
      _sum: { totalAmount: true },
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });

    res.json(
      ApiResponse.success(
        { totalSales: totalSales._sum.totalAmount || 0 },
        'Total sales retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

// Get sales by table
export const getSalesByTable = async (req, res, next) => {
  try {
    const salesByTable = await prisma.table.findMany({
      include: {
        orders: {
          where: { status: 'completed' },
          select: { total: true },
        },
      },
    });

    const salesData = salesByTable.map((table) => ({
      tableNumber: table.number,
      totalSales: table.orders.reduce((acc, order) => acc + order.total, 0),
    }));

    res.json(
      ApiResponse.success(salesData, 'Sales by table retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

// Get daily sales for a date range
export const getSalesByDay = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;

    const salesByDay = await prisma.invoice.groupBy({
      by: ['createdAt'],
      _sum: { totalAmount: true },
      where: {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const dailySales = salesByDay.map((item) => ({
      date: item.createdAt.toISOString().split('T')[0],
      totalSales: item._sum.totalAmount || 0,
    }));

    res.json(
      ApiResponse.success(dailySales, 'Daily sales retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};