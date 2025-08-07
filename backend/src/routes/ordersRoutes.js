import express from 'express';
import { 
  createOrder, 
  getAllOrders, 
  getOrderById ,
  updateOrderStatus  
} from '../controllers/ordersController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// All order routes require authentication (applied in app.js)

// Create order - all authenticated users can create orders
router.post('/create', createOrder);

// View orders - different access levels
router.get('/', getAllOrders); // All staff can view orders

router.get('/:orderId', getOrderById); // All staff can view specific order
router.patch('/:orderId/status', authorize, updateOrderStatus); 

// Future: Add update and delete routes with proper authorization
// router.patch('/:orderId/status', authorize('ADMIN', 'MANAGER'), updateOrderStatus);
// router.delete('/:orderId', authorize('ADMIN'), deleteOrder);

export default router;