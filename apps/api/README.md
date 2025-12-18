# Jahongir Travel Platform - API

NestJS backend API for the Jahongir Travel Platform.

## 🚀 Quick Start

```bash
# Install dependencies
cd ~/projects/jahongir-travel-platform
pnpm install

# Start Docker (from project root)
docker-compose up -d

# Setup database
cd apps/api
cp .env.example .env
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed

# Start API
pnpm start:dev
```

API available at: **http://localhost:4000/api**

## 📚 API Endpoints

### Tours
```
GET    /api/tours              # List all tours (with filters)
GET    /api/tours/featured     # Get featured tours
GET    /api/tours/:slug        # Get tour by slug
GET    /api/tours/category/:slug  # Get tours by category
POST   /api/tours              # Create tour (admin)
PATCH  /api/tours/:id          # Update tour (admin)
DELETE /api/tours/:id          # Delete tour (admin)
```

### Query Parameters
```
?page=1                    # Pagination
?limit=20                  # Items per page
?categoryId=xyz            # Filter by category
?minPrice=100&maxPrice=500 # Price range
?difficulty=easy           # Filter by difficulty
?search=samarkand          # Search tours
?sortBy=price-asc          # Sort order
?featured=true             # Featured only
```

## 🗄️ Database Management

```bash
# Open Prisma Studio (visual DB editor)
pnpm prisma:studio         # http://localhost:5555

# Generate Prisma Client
pnpm prisma:generate

# Create migration
pnpm prisma:migrate

# Seed database
pnpm prisma:seed
```

## 🛠️ Development

```bash
# Start in watch mode
pnpm start:dev

# Run tests
pnpm test
pnpm test:e2e
pnpm test:cov

# Lint & format
pnpm lint
pnpm format
```

## 📁 Project Structure

```
apps/api/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── prisma/           # Prisma service
│   ├── tours/            # Tours module
│   │   ├── dto/         # Data Transfer Objects
│   │   ├── tours.service.ts
│   │   ├── tours.controller.ts
│   │   └── tours.module.ts
│   ├── app.module.ts
│   └── main.ts
└── test/
```

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jahongir_travel_dev"
APP_PORT=4000
WEB_URL="http://localhost:3000"
ADMIN_URL="http://localhost:3001"
```

## 📖 Documentation

- Full API documentation: [../../../GETTING_STARTED.md](../../../GETTING_STARTED.md)
- NestJS Docs: https://docs.nestjs.com
- Prisma Docs: https://www.prisma.io/docs

---

**Built with ❤️ for Uzbekistan tourism**
