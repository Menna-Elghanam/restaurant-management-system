import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './src/routes/authRoutes.js';
import menuRoutes from './src/routes/menuRoutes.js';
import orderRoutes from './src/routes/ordersRoutes.js';
import tableRoutes from './src/routes/tableRoutes.js';  
import invoiceRoutes from './src/routes/invoiceRoutes.js';
import salesRoutes from './src/routes/salesRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js'; 

// Import middleware
import { errorHandler, notFound } from './src/middleware/errorHandler.js';
import { authenticate } from './src/middleware/auth.js';

dotenv.config();

const app = express();

// Trust proxy (important for rate limiting and security headers)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, 
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: {
//     success: false,
//     statusCode: 429,
//     message: 'Too many requests from this IP, please try again later.',
//     timestamp: new Date().toISOString()
//   },
//   standardHeaders: true, 
//   legacyHeaders: false, 
// });

// app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? [process.env.FRONTEND_URL] 
      : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173' , 'http://localhost:5174'  
];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid JSON',
        timestamp: new Date().toISOString()
      });
    }
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// API Info endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Restaurant Management API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      categories: '/api/v1/categories',
      menu: '/api/v1/menu',
      orders: '/api/v1/orders',
      tables: '/api/v1/tables',
      invoices: '/api/v1/invoices',
      sales: '/api/v1/sales'
    },
    documentation: 'Check README.md for complete API documentation',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    }
  });
});

// API Routes
// Public routes (no authentication required)
app.use('/api/v1/auth', authRoutes);           // Authentication endpoints
app.use('/api/v1/categories', categoryRoutes); // Public category viewing
app.use('/api/v1/menu', menuRoutes);           // Public menu viewing

// Protected routes (authentication required)
app.use('/api/v1/orders', authenticate, orderRoutes);     // Order management
app.use('/api/v1/tables', authenticate, tableRoutes);     // Table management  
app.use('/api/v1/invoices', authenticate, invoiceRoutes); // Invoice management
app.use('/api/v1/sales', authenticate, salesRoutes);      // Sales analytics

// Handle undefined routes (404)
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');  
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
Server: http://localhost:${PORT}

  `);
});

export default app;