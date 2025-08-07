import express from 'express';
import {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication needed for viewing menu)
router.get('/', getAllMenuItems);
router.get('/:id', getMenuItemById);

// Protected routes (authentication required)
// Only Admin and Manager can manage menu items
router.use(authenticate); // Apply authentication to all routes below

router.post('/', 
  authorize('ADMIN', 'MANAGER'), 
  createMenuItem
);

router.put('/:id', 
  authorize('ADMIN', 'MANAGER'), 
  updateMenuItem
);

router.delete('/:id', 
  authorize('ADMIN', 'MANAGER'), 
  deleteMenuItem
);

export default router;