# RevCart-P1 - Premium Grocery Delivery Application

A complete full-stack monolithic e-commerce grocery delivery web application with premium UI inspired by Swiggy Instamart.

## 🚀 Tech Stack

### Backend
- **Spring Boot 3.x** - Main framework
- **Spring Security** - JWT Authentication
- **Spring Data JPA** - MySQL integration
- **Spring Data MongoDB** - NoSQL for logs/notifications
- **WebSockets** - Real-time notifications
- **Maven** - Build tool

### Frontend
- **Angular 18** - Modern framework with standalone components
- **TypeScript** - Type safety
- **RxJS** - Reactive programming
- **Custom CSS** - Premium glassmorphism design
- **Font Awesome** - Icons
- **Inter Font** - Typography

### Databases
- **MySQL** - Primary data (users, products, orders)
- **MongoDB** - Logs, notifications, analytics

## 🎨 UI Features

- **Glassmorphism Design** - Semi-transparent cards with backdrop blur
- **Neon Accents** - Glowing elements and animations
- **Gradient Backgrounds** - Premium color schemes
- **Micro Animations** - Smooth hover effects and transitions
- **Responsive Design** - Mobile-first approach
- **Loading States** - Premium loading animations

## 📁 Project Structure

```
RevCart/
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/com/revcart/
│   │   ├── entity/         # JPA Entities
│   │   ├── repository/     # Data repositories
│   │   ├── controller/     # REST Controllers
│   │   ├── service/        # Business logic
│   │   ├── security/       # JWT & Security
│   │   ├── config/         # Configuration
│   │   └── dto/           # Data Transfer Objects
│   └── pom.xml            # Maven dependencies
│
└── revcart-frontend/       # Angular Frontend
    ├── src/app/
    │   ├── components/     # UI Components
    │   ├── services/       # Angular services
    │   ├── models/         # TypeScript interfaces
    │   ├── guards/         # Route guards
    │   └── interceptors/   # HTTP interceptors
    └── package.json       # NPM dependencies
```

## 🛠️ Setup Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- MongoDB 4.4+
- Maven 3.6+

### Backend Setup

1. **Clone and navigate to backend**
   ```bash
   cd RevCart/backend
   ```

2. **Configure database in application.yml**
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/revcart_db
       username: root
       password: root
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd RevCart/revcart-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

Frontend will start on `http://localhost:4200`

## 🔐 Demo Accounts

### Customer Account
- **Email:** customer@demo.com
- **Password:** password123

### Admin Account
- **Email:** admin@demo.com
- **Password:** password123

### Delivery Agent Account
- **Email:** delivery@demo.com
- **Password:** password123

## 🌟 Key Features

### Customer Features
- **Premium Homepage** - Hero section with trending products
- **Product Catalog** - Category-wise browsing with search
- **Shopping Cart** - Real-time cart management
- **Checkout Process** - Multiple payment options
- **Order Tracking** - Real-time status updates

### Admin Features
- **Dashboard** - Business analytics and metrics
- **Product Management** - CRUD operations
- **Order Management** - Status updates and tracking
- **User Management** - Customer and delivery agent management

### Delivery Agent Features
- **Order Assignment** - View assigned deliveries
- **Status Updates** - Update delivery progress
- **Route Optimization** - Efficient delivery planning

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{category}` - Get products by category
- `GET /api/products/search?q={query}` - Search products
- `POST /api/products` - Create product (Admin only)

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders/user` - Get user orders
- `GET /api/orders/admin` - Get all orders (Admin only)
- `PUT /api/orders/{id}/status` - Update order status

## 🔄 Real-time Features

- **WebSocket Notifications** - Order status updates
- **Live Cart Updates** - Real-time cart synchronization
- **Delivery Tracking** - Live location updates
- **Admin Notifications** - New order alerts

## 🎨 Design System

### Colors
- **Primary Gradient:** `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Neon Blue:** `#00d4ff`
- **Neon Purple:** `#b537f2`
- **Glass Background:** `rgba(255, 255, 255, 0.1)`

### Typography
- **Font Family:** Inter
- **Weights:** 300, 400, 500, 600, 700, 800

### Components
- **Glass Cards** - Backdrop blur with transparency
- **Neon Buttons** - Glowing interactive elements
- **Floating Animations** - Smooth micro-interactions

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Adaptive layouts for tablets
- **Desktop Enhanced** - Full-featured desktop experience

## 🚀 Deployment

### Backend Deployment
```bash
mvn clean package
java -jar target/revcart-backend-1.0.0.jar
```

### Frontend Deployment
```bash
npm run build
# Deploy dist/ folder to web server
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the demo accounts for testing

---

**RevCart-P1** - Premium grocery delivery experience! 🛒✨