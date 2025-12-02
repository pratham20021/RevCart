# RevCart Setup Instructions

## Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Database Setup

### 1. Install and Start MySQL
```bash
# Start MySQL service (Windows)
net start mysql

# Or start MySQL using XAMPP/WAMP if you're using those
```

### 2. Create Database
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database (will be auto-created by Spring Boot)
-- No manual creation needed due to createDatabaseIfNotExist=true
```

### 3. Update Database Credentials (if needed)
Edit `backend/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/revcart_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: your_mysql_password  # Change this to your MySQL root password
```

## Quick Start

### Option 1: Start Both Services Together
```bash
# Run from RevCart root directory
start-both.bat
```

### Option 2: Start Services Separately

#### Start Backend
```bash
# Terminal 1 - Backend
cd backend
mvn clean compile
mvn spring-boot:run
```

#### Start Frontend
```bash
# Terminal 2 - Frontend
cd revcart-frontend
npm install
npm start
```

## Access URLs
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080/api
- **API Documentation**: http://localhost:8080/api/swagger-ui.html (if Swagger is configured)

## Demo Accounts
- **Customer**: customer@demo.com / password123
- **Admin**: admin@demo.com / password123
- **Delivery Agent**: delivery@demo.com / password123

## Troubleshooting

### Frontend Issues
1. **Port 4200 already in use**:
   ```bash
   # Kill process using port 4200
   netstat -ano | findstr :4200
   taskkill /PID <PID_NUMBER> /F
   ```

2. **Node modules issues**:
   ```bash
   cd revcart-frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

### Backend Issues
1. **Port 8080 already in use**:
   ```bash
   # Kill process using port 8080
   netstat -ano | findstr :8080
   taskkill /PID <PID_NUMBER> /F
   ```

2. **MySQL connection issues**:
   - Ensure MySQL is running
   - Check username/password in application.yml
   - Verify MySQL is accessible on localhost:3306

3. **Maven build issues**:
   ```bash
   cd backend
   mvn clean install -U
   ```

## Development Notes
- Frontend runs in development mode with hot reload
- Backend auto-creates database tables on first run
- Sample data is automatically loaded on startup
- CORS is configured to allow frontend-backend communication

## Production Deployment
1. Build frontend: `cd revcart-frontend && npm run build`
2. Build backend: `cd backend && mvn clean package`
3. Deploy `dist/` folder and `target/*.jar` to your server