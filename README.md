# AgriConnect Backend

A modern, scalable backend API for connecting farmers and suppliers in an agricultural marketplace.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: CRUD operations for agricultural products
- **Order Management**: Complete order lifecycle management
- **Category Management**: Product categorization system
- **Health Checks**: API health monitoring
- **Validation**: Request validation using Zod schemas
- **Error Handling**: Centralized error handling with custom error classes
- **Database**: PostgreSQL with Prisma ORM
- **TypeScript**: Full type safety throughout the application
- **Clean Architecture**: Well-structured, maintainable codebase

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT
- **Password Hashing**: bcrypt
- **CORS**: Enabled for cross-origin requests

## 📁 Project Structure

```
src/
├── config/                 # Configuration management
│   └── index.ts
├── controllers/            # Request handlers
│   ├── auth.controller.ts
│   ├── product.controller.ts
│   ├── category.controller.ts
│   ├── order.controller.ts
│   └── health.controller.ts
├── database/              # Database connection and management
│   └── index.ts
├── middleware/            # Custom middleware
│   ├── requireAuth.ts
│   ├── validation.ts
│   ├── errorHandler.ts
│   └── common.ts
├── routes/               # Route definitions
│   ├── auth.routes.ts
│   ├── product.routes.ts
│   ├── category.routes.ts
│   ├── order.routes.ts
│   ├── health.routes.ts
│   └── index.ts
├── services/             # Business logic layer
│   ├── auth.service.ts
│   ├── product.service.ts
│   ├── category.service.ts
│   └── order.service.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── errors.ts
│   ├── response.ts
│   ├── jwt.ts
│   └── helpers.ts
├── validators/         # Zod validation schemas
│   ├── user.ts
│   ├── product.ts
│   ├── category.ts
│   └── order.ts
└── index.ts           # Application entry point
```

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/medalichakhari/Agriconnect_backend.git
   cd Agriconnect_backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/agriconnect"
   JWT_SECRET="your-super-secret-jwt-key-here"
   JWT_EXPIRES_IN="7d"
   PORT=4000
   NODE_ENV="development"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🚀 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile

### Products

- `GET /api/v1/products` - Get all products (with pagination, search, filters)
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create new product (farmers only)
- `PUT /api/v1/products/:id` - Update product (owner only)
- `DELETE /api/v1/products/:id` - Delete product (owner only)

### Categories

- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get category by ID
- `POST /api/v1/categories` - Create new category
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Orders

- `GET /api/v1/orders` - Get user's orders
- `GET /api/v1/orders/:id` - Get order by ID
- `POST /api/v1/orders` - Create new order
- `PUT /api/v1/orders/:id/status` - Update order status (farmer only)
- `PUT /api/v1/orders/:id/cancel` - Cancel order

### Health

- `GET /api/v1/health` - Health check
- `GET /api/v1/info` - API information

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **FARMER**: Can create, update, delete products; manage orders for their products
- **SUPPLIER**: Can browse products, place orders, view their orders

## 📊 Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: User accounts with roles
- **Product**: Agricultural products with details
- **Category**: Product categories
- **Order**: Order transactions between suppliers and farmers

## 🛡️ Error Handling

The API includes comprehensive error handling with custom error classes:

- `ValidationError` (400): Request validation errors
- `AuthenticationError` (401): Authentication failures
- `AuthorizationError` (403): Access denied
- `NotFoundError` (404): Resource not found
- `ConflictError` (409): Resource conflicts
- `InternalServerError` (500): Server errors

## 📝 Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## 🧪 Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio
npm run prisma:reset    # Reset database

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors
npm run type-check      # TypeScript type checking

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
```

## 🐳 Docker Support

Run with Docker Compose:

```bash
npm run dev:docker
```

## 🔄 Environment Variables

| Variable          | Description                  | Default       |
| ----------------- | ---------------------------- | ------------- |
| `DATABASE_URL`    | PostgreSQL connection string | Required      |
| `JWT_SECRET`      | JWT signing secret           | Required      |
| `JWT_EXPIRES_IN`  | JWT expiration time          | `7d`          |
| `PORT`            | Server port                  | `4000`        |
| `NODE_ENV`        | Environment mode             | `development` |
| `ALLOWED_ORIGINS` | CORS allowed origins         | `*`           |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - _Initial work_ - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- Prisma team for the amazing ORM
- All contributors who have helped shape this project
