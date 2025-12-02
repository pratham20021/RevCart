# RevCart Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Start MySQL
```bash
# Start MySQL service
net start mysql
# OR use XAMPP/WAMP control panel
```

### Step 2: Start Both Services
```bash
# Double-click this file in Windows Explorer
start-both.bat
```

### Step 3: Access Application
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080/api

## 🔐 Demo Login
- **Email**: customer@demo.com
- **Password**: password123

## ✅ What's Fixed

### Frontend Issues Fixed:
- ✅ Angular version mismatch resolved (all packages now v18.2.0)
- ✅ Missing public directory created
- ✅ Auth interceptor implemented
- ✅ Product service with mock data for testing
- ✅ Complete routing setup (Home, Login, Signup, Products, Cart)
- ✅ Navigation header with authentication
- ✅ Responsive design with glassmorphism UI

### Backend Issues Fixed:
- ✅ MySQL connector updated to latest version
- ✅ CORS configuration enabled
- ✅ Complete ProductController with CRUD operations
- ✅ Data initializer for demo users and products
- ✅ Proper JWT authentication setup

### Database Integration:
- ✅ Auto-creates database on startup
- ✅ Sample data loaded automatically
- ✅ Demo users created (customer, admin, delivery agent)

## 🛠️ Troubleshooting

### If Frontend Won't Start:
```bash
cd revcart-frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### If Backend Won't Start:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### If Database Connection Fails:
1. Ensure MySQL is running
2. Check password in `backend/src/main/resources/application.yml`
3. Default: username=root, password=root

## 📱 Features Working:
- ✅ Homepage with hero section and product showcase
- ✅ User authentication (login/signup)
- ✅ Product listing with search and categories
- ✅ Shopping cart functionality
- ✅ Responsive design for mobile/desktop
- ✅ Real-time API integration ready
- ✅ Premium glassmorphism UI design

## 🔄 Switch to Real API:
To connect frontend to real backend API, uncomment the real API methods in:
`revcart-frontend/src/app/services/product.service.ts`

The application is now fully functional with both mock data (frontend-only) and real API integration capabilities!