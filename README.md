# Restaurant Management System

A modern, full-stack restaurant management solution with comprehensive features for menu management, order processing, table reservations, and sales analytics.

## Tech Stack

**Frontend:**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Backend:**
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

## Features

- **User Authentication** - Role-based access control (Admin, Manager, Staff)
- **Menu Management** - Complete CRUD operations with categories and search
- **Order Processing** - Dine-in, takeaway, and delivery order handling
- **Table Management** - Real-time status tracking and reservations
- **Invoice System** - Automated billing with payment tracking
- **Sales Analytics** - Comprehensive reporting and business insights
- **Responsive Design** - Modern UI optimized for all devices
- **Real-time Updates** - Live order status and table management

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 18.0 or higher)
- MySQL (version 8.0 or higher)
- npm or yarn package manager
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/restaurant-management-system.git
   cd restaurant-management-system
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Configuration**
   
   Create environment files for both frontend and backend:
   
   **Backend (.env in /backend directory):**
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/restaurant_db"
   JWT_SECRET="your-super-secure-jwt-secret-key-here"
   JWT_EXPIRES_IN="7d"
   PORT=5000
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:3000"
   ```

   **Frontend (.env in /frontend directory):**
   ```env
   VITE_API_BASE_URL="http://localhost:5000/api/v1"
   VITE_APP_NAME="Restaurant Management System"
   ```

4. **Database Setup**
   ```bash
   cd backend
   
   # Generate Prisma client
   npx prisma generate
   
   # Apply database schema
   npx prisma db push
   
   # Seed database with sample data
   npm run db:seed
   ```

## Running the Application

### Development Mode

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend Application:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start backend server
cd ../backend
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile

### Menu Management
- `GET /api/v1/menu` - Get all menu items
- `POST /api/v1/menu` - Create menu item (Admin/Manager)
- `PUT /api/v1/menu/:id` - Update menu item (Admin/Manager)
- `DELETE /api/v1/menu/:id` - Delete menu item (Admin/Manager)

### Order Processing
- `POST /api/v1/orders/create` - Create new order
- `GET /api/v1/orders` - Get all orders
- `GET /api/v1/orders/:id` - Get specific order

### Table Management
- `GET /api/v1/tables` - Get all tables
- `POST /api/v1/tables` - Create table (Admin/Manager)
- `PUT /api/v1/tables/:id` - Update table status

### Sales Analytics
- `POST /api/v1/sales/total` - Get total sales (Admin/Manager)
- `GET /api/v1/sales/by-table` - Sales by table (Admin/Manager)
- `POST /api/v1/sales/by-day` - Daily sales report (Admin/Manager)

Full API documentation available at: `http://localhost:5000/api-docs`

## Default Users

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Admin | admin@restaurant.com | admin123 | Full system access |
| Manager | manager@restaurant.com | manager123 | Operations & reporting |
| Staff | staff@restaurant.com | staff123 | Basic operations |

## Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server with hot reload
npm start           # Start production server
npm run db:generate # Generate Prisma client
npm run db:push     # Apply schema to database
npm run db:seed     # Seed database with sample data
npm run db:studio   # Open Prisma Studio
```

### Frontend Scripts
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

## Architecture

### Project Structure
```
restaurant-management-system/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   └── utils/           # Utility functions
│   ├── prisma/              # Database schema & migrations
│   └── package.json
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service functions
│   │   ├── store/           # State management
│   │   └── utils/           # Utility functions
│   └── package.json
└── README.md
```

### Security Features
- JWT-based authentication with secure token storage
- Password hashing using bcrypt
- Role-based access control
- Rate limiting and request validation
- CORS protection
- Input sanitization



## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request


Built with modern technologies for efficient restaurant management
