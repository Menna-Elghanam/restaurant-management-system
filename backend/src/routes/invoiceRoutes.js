import express from 'express';
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoiceStatus,
} from '../controllers/invoiceController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// All invoice routes require authentication (applied in app.js)

// All staff can create and view invoices
router.post('/create', createInvoice);
router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);

// Only Admin and Manager can update invoice status
router.patch('/:id/status', 
  authorize('ADMIN', 'MANAGER'), 
  updateInvoiceStatus
);

export default router;