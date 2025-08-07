import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerUser, loginUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Rate limiting for auth endpoints (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    statusCode: 429
  }
});

// Public routes
router.post('/register', authLimiter, registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', authenticate, (req, res) => {
  res.json({
    success: true,
    statusCode: 200,
    message: 'Profile retrieved successfully',
    data: req.user,
    timestamp: new Date().toISOString()
  });
});

export default router;