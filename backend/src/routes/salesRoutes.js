import express from 'express';
import { 
  getTotalSales, 
  getSalesByTable, 
  getSalesByDay 
} from '../controllers/salesController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// All sales routes require authentication (applied in app.js)
// Only Admin and Manager can access sales data

router.use(authorize('ADMIN', 'MANAGER'));

router.post('/total', getTotalSales);
router.get('/by-table', getSalesByTable);
router.post('/by-day', getSalesByDay);

export default router;