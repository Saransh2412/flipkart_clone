# ShopSphere Backend

This is the backend for ShopSphere — a production-grade e-commerce API. It provides complete user authentication, a product catalog with search, cart management, wishlist capabilities, Stripe payment integration, transactional order emails, and a robust order system.

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express 5
* **Database:** PostgreSQL (Neon — serverless)
* **ORM:** Sequelize 6
* **Auth:** bcryptjs + jsonwebtoken
* **Payments:** Stripe Checkout Sessions
* **Email:** Resend API
* **Hosting:** Render

## Architecture

```
Routes → Controllers → Services → Models (Sequelize) → PostgreSQL
```

Cleanly separated concern layers with centralized error handling middleware.

## Quick Start

```bash
npm install
cp .env.example .env   # Configure your credentials
node migrate.js         # Sync database tables
node seed_50_products.js  # Seed product data
npm run dev             # Start with nodemon
```

## Environment Variables

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
RESEND_API_KEY=re_...
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

* **Auth:** `POST /api/auth/signup`, `POST /api/auth/login`, `PUT /api/auth/profile`
* **Products:** `GET /api/products`, `GET /api/products/:id`
* **Cart:** `GET /api/cart`, `POST /api/cart`, `PUT /api/cart/:id`, `DELETE /api/cart/:id`
* **Wishlist:** `GET /api/wishlist`, `POST /api/wishlist`, `DELETE /api/wishlist/:id`
* **Orders:** `GET /api/orders`, `GET /api/orders/:id`, `POST /api/orders`
* **Stripe:** `POST /api/stripe/create-checkout-session`, `POST /api/stripe/verify-session`
* **System:** `GET /health`, `GET /ready`, `GET /api/status/db`

## Production Deployment (Render)

Set these environment variables in your Render service:

```env
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Health Monitoring

- `GET /health` — Lightweight liveness probe (no DB hit, 0% compute cost)
- `GET /ready` — Readiness probe with 24-hour cached DB status check

### Uptime Monitor

- URL: `https://your-api.onrender.com/health`
- Method: `GET`
- Interval: `5 min`
- Timeout: `20-30s`

## Postman Collection

Import `ShopSphere.postman_collection.json` into Postman to test all endpoints.
