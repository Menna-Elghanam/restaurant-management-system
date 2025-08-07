import prisma from '../config/database.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const createInvoice = async (req, res, next) => {
  try {
    const { orderId, billingName, billingAddress, billingEmail, billingPhone } = req.body;

    // Check if the invoice already exists for the order
    const existingInvoice = await prisma.invoice.findUnique({
      where: { orderId: parseInt(orderId) },
    });

    if (existingInvoice) {
      return res.status(400).json(
        ApiResponse.error('Invoice already exists for this order', 400)
      );
    }

    // Fetch the order to get the total amount
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!order) {
      return res.status(404).json(
        ApiResponse.error('Order not found', 404)
      );
    }

    const invoice = await prisma.invoice.create({
      data: {
        orderId: parseInt(orderId),
        billingName,
        billingAddress,
        billingEmail,
        billingPhone,
        totalAmount: order.total,
        status: 'unpaid',
      },
    });

    res.status(201).json(
      ApiResponse.success(invoice, 'Invoice created successfully', 201)
    );
  } catch (error) {
    next(error);
  }
};

export const getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        order: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            },
            orderItems: {
              include: { menuItem: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(ApiResponse.success(invoices, 'Invoices retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) },
      include: {
        order: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            },
            orderItems: {
              include: { menuItem: true },
            },
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json(
        ApiResponse.error('Invoice not found', 404)
      );
    }

    res.json(ApiResponse.success(invoice, 'Invoice retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateInvoiceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Get invoice with order info
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) },
      include: {
        order: {
          include: { table: true }
        }
      }
    });

    if (!existingInvoice) {
      return res.status(404).json(
        ApiResponse.error('Invoice not found', 404)
      );
    }

    // ✅ UPDATE INVOICE AND FREE TABLE
    const result = await prisma.$transaction(async (prisma) => {
      const updatedInvoice = await prisma.invoice.update({
        where: { id: parseInt(id) },
        data: { status },
        include: {
          order: {
            include: {
              user: {
                select: { id: true, name: true, email: true }
              },
              orderItems: {
                include: { menuItem: true },
              },
            },
          },
        },
      });

      // ✅ FREE TABLE WHEN PAID
      if (status === 'paid' && 
          existingInvoice.order.orderType === 'PLACE' && 
          existingInvoice.order.tableId) {
        await prisma.table.update({
          where: { id: existingInvoice.order.tableId },
          data: { status: 'Free' }
        });
      }

      return updatedInvoice;
    });

    res.json(
      ApiResponse.success(result, 'Invoice status updated successfully')
    );
  } catch (error) {
    next(error);
  }
};