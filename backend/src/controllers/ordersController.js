import prisma from '../config/database.js';
import { ApiResponse } from '../utils/apiResponse.js';

// Utility function to calculate the total price for the order
const calculateTotal = (menuItems) => {
  return menuItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const createOrder = async (req, res, next) => {
  try {
    const { userId, tableId, menuItems, orderType, deliveryAddress, deliveryTime } = req.body;

    if (!userId || !menuItems || menuItems.length === 0) {
      return res.status(400).json(
        ApiResponse.error('User ID and menu items are required', 400)
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json(
        ApiResponse.error('User not found', 404)
      );
    }

    // Validate table for in-place orders
    if (orderType === 'PLACE' && !tableId) {
      return res.status(400).json(
        ApiResponse.error('Table ID is required for in-place orders', 400)
      );
    }

    // Check if table exists for in-place orders
    if (orderType === 'PLACE') {
      const table = await prisma.table.findUnique({ where: { id: tableId } });
      if (!table) {
        return res.status(404).json(
          ApiResponse.error('Table not found', 404)
        );
      }
    }

    // Validate that all menu items exist
    const menuItemIds = menuItems.map(item => item.menuItemId);
    const existingMenuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } }
    });

    if (existingMenuItems.length !== menuItemIds.length) {
      return res.status(400).json(
        ApiResponse.error('One or more menu items do not exist', 400)
      );
    }

    // ✅ CREATE ORDER AND UPDATE TABLE STATUS
    const result = await prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          userId,
          tableId: orderType === 'PLACE' ? tableId : null,
          total: calculateTotal(menuItems),
          status: 'pending',
          orderType,
          deliveryAddress: orderType === 'DELIVERY' ? deliveryAddress : null,
          deliveryTime: orderType === 'DELIVERY' ? new Date(deliveryTime) : null,
        },
      });

      const orderItems = menuItems.map((item) => ({
        orderId: newOrder.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: item.price,
      }));

      await prisma.orderItem.createMany({
        data: orderItems
      });

      // ✅ UPDATE TABLE TO OCCUPIED FOR PLACE ORDERS
      if (orderType === 'PLACE' && tableId) {
        await prisma.table.update({
          where: { id: tableId },
          data: { status: 'Occupied' }
        });
      }

      return newOrder;
    });

    res.status(201).json(
      ApiResponse.success(result, 'Order created successfully', 201)
    );
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        orderType: {
          in: ['PLACE', 'TAKEAWAY', 'DELIVERY'],
        },
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true }
        },
        table: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(ApiResponse.success(orders, 'Orders retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true }
        },
        table: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json(
        ApiResponse.error('Order not found', 404)
      );
    }

    res.json(ApiResponse.success(order, 'Order retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// ✅ ADD THIS NEW FUNCTION
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true }
        },
        table: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    res.json(ApiResponse.success(updatedOrder, 'Order status updated successfully'));
  } catch (error) {
    next(error);
  }
};