# Football Online Manager

Football Online Manager built with Next.js And Express.js.


## Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm
- **Docker** and **Docker Compose** (for easy setup)
- **PostgreSQL** (if running without Docker)
- **Redis** (if running without Docker)

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Football-Online-Manager
   ```

2. **Start the backend services**
   ```bash
   cd football-online-manager-backend
   docker compose up -d --build
   ```

3. **Install frontend dependencies and start**
   ```bash
   cd ../football-online-manager-frontend
   pnpm install
   pnpm dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - API Documentation (Swagger UI): http://localhost:4000/api/docs
   - Queue Monitoring (Bull Dashboard): http://localhost:4000/admin/queues

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd football-online-manager-backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   NODE_ENV=development
   PORT=4000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASS=password
   DB_NAME=football_manager
   REDIS_HOST=localhost
   REDIS_PORT=6379
   JWT_SECRET=your-super-secret-jwt-key
   COOKIE_SECRET=your-super-secret-cookie-key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start PostgreSQL and Redis**
   ```bash
   # Using Docker for databases
   docker compose up -d --build postgres redis
   ```

5. **Run database migrations**
   ```bash
   pnpm migration:run
   ```

6. **Start the backend server**
   ```bash
   pnpm dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd football-online-manager-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

## 🛠️ Development

### Backend Commands

```bash
# Development
pnpm dev                    # Start with hot reload
pnpm dev:nodemon           # Start with nodemon

# Database
pnpm migration:generate    # Generate new migration
pnpm migration:run         # Run migrations
pnpm migration:revert      # Revert last migration

# Build
pnpm build                # Build for production
pnpm start                # Start production server
```

### Frontend Commands

```bash
# Development
pnpm dev                  # Start development server
pnpm build                # Build for production
pnpm start                # Start production server
pnpm lint                 # Run ESLint
```

## 📁 Project Structure

```
│── football-online-manager-backend/     # Express.js API
│   ├── src/
│   │   ├── config/                      # Configuration files
│   │   ├── controllers/                 # Route controllers
│   │   ├── dtos/                        # Data transfer objects
│   │   ├── interfaces/                  # TypeScript interfaces
│   │   ├── jobs/                        # Background job processors
│   │   ├── middlewares/                 # Express middlewares
│   │   ├── models/                      # TypeORM entities
│   │   ├── routes/                      # API routes
│   │   ├── services/                    # Business logic
│   │   └── utils/                       # Utility functions
│   ├── docker-compose.yaml              # Docker services
│   └── package.json
│
└── football-online-manager-frontend/    # Next.js application
    ├── app/                             # App router pages
    ├── components/                      # React components
    │   ├── atoms/                       # Basic UI components
    │   ├── molecules/                   # Composite components
    │   ├── pages/                       # Page components
    │   └── ui/                          # Radix UI components
    ├── lib/                             # Utilities and configurations
    ├── services/                        # API service functions
    ├── store/                           # Zustand state management
    └── package.json
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=football_manager
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key
COOKIE_SECRET=your-super-secret-cookie-key
COOKIE_NAME=auth_token
COOKIE_MAX_AGE=86400000
COOKIE_HTTP_ONLY=true
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
FRONTEND_URL=http://localhost:3000
```

## 📊 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:4000/api/docs
- **Health Check**: http://localhost:4000/health
- **Queue Monitoring**: http://localhost:4000/admin/queues

## 🐳 Docker

### Backend Services
```bash
cd football-online-manager-backend
docker-compose up -d     # Start all services
docker-compose down      # Stop all services
docker-compose logs      # View logs
```

### Services Included
- **PostgreSQL 15** - Main database
- **Redis 7** - Caching and job queues
- **Backend API** - Express.js application

## 📈 Time Report

### Day 1: Understanding Requirements and Project Initialization
- **4 hours** understanding the project requirements, setting up the repository, and initializing the project structure (backend & frontend).

### Day 2: Authentication Module Implementation
- **2 hours** User registration and login (backend & frontend integration).
- **2 hours** Implemented secure JWT authentication and cookie handling.
- **1 hour** Set up initial user state management and protected routes on the frontend.

### Day 3: Team & Player Modules Foundation
- **2 hours** Designed and set up TypeORM models/entities for Teams and Players.
- **2 hours** Created initial UI components for team and player management.

### Days 4 & 5: Completing Team & Player Modules
- **8 hours** Finalized CRUD operations for teams and players (excluding delete), including associations.
- **2 hours** Designed and implemented user interfaces for managing teams and players.

### Day 6: Dashboard and Transfer Market Feature
- **2 hours** Added a functional dashboard for user insights and navigation.
- **2 hours** Implemented the Transfer Market (purchase/sell players) with backend and frontend integration.
- **1 hour** Added filters and search for the market feature.
- **1 hour** Performed overall review and testing of the application.

### Day 7: Real-time Features, Code Readability, and Documentation
- **2 hours** Integrated Socket.IO for real-time updates (team creation, transfers).
- **2 hours** Improved code readability, refactored for best practices.
- **2 hours** Enhanced documentation, added comments, and updated the README for better developer understanding.

---

## 👨‍💻 Author

**Aziz Souabni**

---