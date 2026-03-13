# Flipkart Clone Backend

This is the backend for a robust Flipkart-style e-commerce application. It provides complete user authentication, a product catalog with search, cart management, wishlist capabilities, and a transactional order system.

## Tech Stack
* **Node.js** & **Express.js**: For fast API routing and middleware composition.
* **PostgreSQL**: Used as a robust relational database.
* **jsonwebtoken & bcryptjs**: For secure, stateless user authentication.
* **Nodemailer**: For sending order confirmation emails.

## Architecture

The project follows a standard **Controller-Service-Repository** paradigm (in our case the Repository logic is inside the modular Services and `db.js`) to keep the codebase clean and modular, mimicking a true production environment suitable for scaling:

- **`src/app.js`**: Express server basic config and middleware loading.
- **`src/routes`**: API Endpoint definitions.
- **`src/controllers`**: Request logic handler (parsing request body/query components) triggering the underlying Service.
- **`src/services`**: Core business logic and direct database queries using PostgreSQL `pg`. Includes robust transaction flows for crucial mechanisms like placing an order.

## Database Setup

1. Install PostgreSQL and start the server.
2. Create root database and user if not existing, or update `.env` to match your Postgres setup.
3. Import schema: `psql -U postgres -d your_db -f database/schema.sql`
4. Import seeder: `psql -U postgres -d your_db -f database/seed.sql`

## Project Setup

1. `npm install`
2. Create `.env` file from the sample and provide your credentials (DB config, Email for Nodemailer, JWT Secret).
3. Start the server via `npm run dev` (uses nodemon) or `npm start` (if configured in package.json).

## API Endpoints

### 1. Authentication
- `POST /api/auth/signup`: Create a user account.
- `POST /api/auth/login`: Issue a JWT upon comparing hashes.

### 2. Products
- `GET /api/products`: View products (Supports `?search=term&category=cat&page=1&limit=10`).
- `GET /api/products/:id`: Get a singular product details.

### 3. Cart *(Requires Auth)*
- `GET /api/cart`: Current items and quantities inside the user cart.
- `POST /api/cart`: Add `productId` and `quantity`.
- `PUT /api/cart/:id`: Update cart item quantity by `id`.
- `DELETE /api/cart/:id`: Remove the cart entry cleanly.

### 4. Wishlist *(Requires Auth)*
- `GET /api/wishlist`: Returns the current user's favourite saved items.
- `POST /api/wishlist`: Add a `productId`.
- `DELETE /api/wishlist/:id`: Remove product from wishlist.

### 5. Orders *(Requires Auth)*
- `POST /api/orders`: Place an order using `shippingAddress`. Clears carts, manages DB transaction gracefully decreasing stock, securely computes item prices, and generates an `OD...` identifier, automatically sending an email confirmation.
- `GET /api/orders`: Return all user order history.
- `GET /api/orders/:id`: Verify a particular order detailing.

## Deployment Instructions

* Ensure `.env` is omitted via `.gitignore` and keys safely injected via Server environments.
* Use PM2 for starting production builds. E.g., `pm2 start src/server.js --name flipkart-api`.
* Set up a Reverse Proxy (like NGINX on an Ubuntu VM) to expose `localhost:5000` via a standard secure connection.
* Connect a managed Postgres DB from a Cloud provider (like AWS RDS or Neon).

## Render Deployment Checklist

Use this checklist for stable production behavior.

### Required Render environment variables

```env
FRONTEND_URL=https://flipkart-clone-hazel-nu.vercel.app,https://flipkart-clone.saranshh.me
NODE_ENV=production
```

### Health endpoint

- Endpoint: `GET /health`
- Expected response: `200` with JSON body
- Readiness endpoint: `GET /ready` (checks API process + database connectivity)

### Uptime monitor settings

- URL: `https://flipkart-clone-w0a3.onrender.com/health`
- Method: `GET` (preferred over `HEAD`)
- Interval: `5 min`
- Timeout: `20-30s`
- Failure threshold: `2-3`

### Incident triage (fast)

- If you see `521`, treat it as origin availability issue first.
- If browser shows CORS missing header at same time, that is usually a secondary symptom of edge HTML error response.
- Confirm API CORS quickly:

```bash
curl -i -H "Origin: https://flipkart-clone.saranshh.me" "https://flipkart-clone-w0a3.onrender.com/api/products?page=1&limit=1"
```

### Request logging

- Structured request logs are enabled by default.
- Disable by setting `REQUEST_LOGGING=false` in Render env vars.
