import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Protected routes - require authentication
router.use(authenticate);

// Only Admin and Manager can manage categories
router.post('/', 
  authorize('ADMIN', 'MANAGER'), 
  createCategory
);

router.patch('/:id', 
  authorize('ADMIN', 'MANAGER'), 
  updateCategory
);

router.delete('/:id', 
  authorize('ADMIN', 'MANAGER'), 
  deleteCategory
);

export default router;