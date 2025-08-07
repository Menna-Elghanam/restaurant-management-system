import express from 'express';
import { 
  createTable, 
  getAllTables, 
  getTableById, 
  updateTable, 
  deleteTable 
} from '../controllers/tableController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// All table routes require authentication (applied in app.js)

// All staff can view tables
router.get('/', getAllTables);
router.get('/:tableId', getTableById);

// Only Admin and Manager can modify tables
router.post('/', 
  authorize('ADMIN', 'MANAGER'), 
  createTable
);

router.put('/:tableId', 
  authorize('ADMIN', 'MANAGER'), 
  updateTable
);

router.delete('/:tableId', 
  authorize('ADMIN', 'MANAGER'), 
  deleteTable
);

export default router;