<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed-Live-00C853?style=for-the-badge" />
</p>

# 🛒 ShopSphere — Full-Stack E-Commerce Platform

> A production-grade, full-stack e-commerce web application with **Stripe payments**, **transactional emails**, **edge-optimised images**, and a **sub-200 ms perceived load time** — built from the ground up with React, Node.js, and PostgreSQL.

**🔗 [Live Demo](https://ecom.saranshh.me)** &nbsp;|&nbsp; **📄 [PRD](./PRD.md)** &nbsp;|&nbsp; **📬 [API Collection (Postman)](./backend/ShopSphere.postman_collection.json)**

---

## ⚡ Why This Project Stands Out

This is **not** a tutorial follow-along. ShopSphere is an independently architected system that demonstrates:

| Area | What I Built |
|------|-------------|
| **Architecture** | Cleanly layered backend — Routes → Controllers → Services → Models with Sequelize ORM |
| **Payments** | Full Stripe Checkout Sessions integration with server-side verification and idempotent order fulfillment |
| **Performance** | Client-side SWR (Stale-While-Revalidate) caching + Cloudflare Edge CDN image optimisation (up to 80% bandwidth savings) |
| **Database** | Transactional order placement with row-level stock locking (`SELECT … FOR UPDATE`) and atomic rollback |
| **Observability** | Tiered health probes (`/health` — zero DB cost, `/ready` — 24 h cached), structured request logging |
| **Email** | Transactional order confirmations via Resend API with fire-and-forget resilience |
| **DevOps** | Multi-origin CORS, environment-driven config, Render (API) + Vercel (frontend) + Neon (DB) |

---

## 🎯 Features

### 🛍️ Shopping Experience
- **Product Catalog** — Paginated listings with category filtering, free-text search, and multi-image product detail pages
- **Cart & Wishlist** — Server-persisted cart (survives logout), quantity management, real-time navbar badge updates
- **Stripe Checkout** — PCI-compliant payment flow with shipping address collection and automatic order creation
- **Order History** — Chronological order tracking with detailed line-item breakdowns

### 🔐 Auth & Security
- **JWT Authentication** — Secure token-based auth with protected routes and auto-rehydrating sessions
- **Password Hashing** — bcryptjs with salt rounds, never stored in plaintext
- **CORS Whitelisting** — Environment-driven multi-origin configuration

### 🚀 Performance & Reliability
- **0 ms Perceived Load** — Homepage products served instantly from localStorage, silently refreshed in background (SWR pattern)
- **Edge CDN Images** — All product images routed through `wsrv.nl` (Cloudflare) for on-the-fly WebP conversion and 31-day caching
- **Cold-Start UX** — Friendly "Waking up server…" message after 2.5 s delay, so users aren't left staring at spinners
- **Atomic Transactions** — Orders created within Sequelize transactions: stock verified, items moved, cart cleared — or everything rolls back
- **Idempotent Payments** — Double-verification protection prevents duplicate order creation from retry clicks

### 📧 Transactional Emails
- **Order Confirmation** — Rich HTML email with order summary, sent via Resend API on successful checkout
- **Resilient Delivery** — Fire-and-forget pattern ensures email failures never block or roll back orders

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                       │
│   React 19 + Vite  │  SWR Cache  │  wsrv.nl CDN Images  │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTPS (Axios + JWT Bearer)
                         ▼
┌──────────────────────────────────────────────────────────┐
│                  API SERVER (Render)                      │
│   Express 5  │  CORS  │  Request Logging  │  Health ✓    │
│                                                          │
│   Routes ──→ Controllers ──→ Services ──→ Sequelize ORM  │
└─────────┬──────────────────────────┬─────────────────────┘
          │                          │
          ▼                          ▼
   ┌─────────────┐          ┌──────────────┐
   │ PostgreSQL  │          │  Stripe API  │──→ Resend API
   │   (Neon)    │          │  (Payments)  │    (Emails)
   └─────────────┘          └──────────────┘
```

---

## 🗄️ Data Model

```
User ──1:N──→ CartItem ──N:1──→ Product ──N:1──→ Category
  │                                │
  ├──1:N──→ Wishlist ──N:1─────────┤
  │                                │
  └──1:N──→ Order ──1:N──→ OrderItem ──N:1──→ Product
                                   │
                           Product ──1:N──→ ProductImage
```

**8 models** with enforced referential integrity: `CASCADE` deletes on user-owned data, `RESTRICT` on order→product (preserves order history).

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React, Vite, React Router DOM | 19.x, 6.x |
| State | React Context API | — |
| HTTP Client | Axios | 1.x |
| Styling | Vanilla CSS (component-scoped) | — |
| UI Kit | React Icons, React Toastify | — |
| Backend | Node.js, Express | 5.x |
| ORM | Sequelize | 6.x |
| Database | PostgreSQL (Neon — serverless) | 16.x |
| Payments | Stripe (Checkout Sessions) | 22.x |
| Email | Resend | 6.x |
| Image CDN | wsrv.nl (Cloudflare Edge Network) | — |
| Hosting | Render (API), Vercel (Frontend) | — |

---

## 📡 API Reference

<details>
<summary><strong>Authentication</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signup` | ✗ | Register a new user |
| `POST` | `/api/auth/login` | ✗ | Login, returns JWT |
| `PUT` | `/api/auth/profile` | ✓ | Update shipping address |

</details>

<details>
<summary><strong>Products</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/products?page=1&limit=10&search=&category=` | ✗ | Paginated product list with search & category filter |
| `GET` | `/api/products/:id` | ✗ | Product detail with images |

</details>

<details>
<summary><strong>Cart</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/cart` | ✓ | View user's cart |
| `POST` | `/api/cart` | ✓ | Add item `{ productId, quantity }` |
| `PUT` | `/api/cart/:id` | ✓ | Update quantity `{ quantity }` |
| `DELETE` | `/api/cart/:id` | ✓ | Remove item from cart |

</details>

<details>
<summary><strong>Wishlist</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/wishlist` | ✓ | View wishlist |
| `POST` | `/api/wishlist` | ✓ | Add product `{ productId }` |
| `DELETE` | `/api/wishlist/:id` | ✓ | Remove from wishlist |

</details>

<details>
<summary><strong>Orders & Payments</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/stripe/create-checkout-session` | ✓ | Create Stripe checkout session from cart |
| `POST` | `/api/stripe/verify-session` | ✓ | Verify payment & create order (idempotent) |
| `GET` | `/api/orders` | ✓ | Order history |
| `GET` | `/api/orders/:id` | ✓ | Order detail with line items |

</details>

<details>
<summary><strong>System</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | ✗ | Liveness probe (no DB hit, 0% compute cost) |
| `GET` | `/ready` | ✗ | Readiness probe (24 h cached DB status) |
| `GET` | `/api/status/db` | ✗ | Manual DB connectivity check |

</details>

> 💡 A full Postman collection is available at [`backend/ShopSphere.postman_collection.json`](./backend/ShopSphere.postman_collection.json) for easy API testing.

---

## 📂 Project Structure

```
ShopSphere/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection (Sequelize + Neon)
│   │   ├── controllers/     # HTTP request handlers
│   │   │   ├── authController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   ├── productController.js
│   │   │   ├── stripeController.js
│   │   │   └── wishlistController.js
│   │   ├── middleware/       # Auth (JWT) & error handling
│   │   ├── models/           # Sequelize models (8 entities)
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Category.js
│   │   │   ├── ProductImage.js
│   │   │   ├── CartItem.js
│   │   │   ├── Order.js
│   │   │   ├── OrderItem.js
│   │   │   ├── Wishlist.js
│   │   │   └── index.js      # Association definitions
│   │   ├── routes/           # Express route definitions
│   │   ├── services/         # Core business logic
│   │   │   ├── authService.js
│   │   │   ├── cartService.js
│   │   │   ├── orderService.js     # Transactional order placement
│   │   │   ├── productService.js   # Paginated queries + search
│   │   │   ├── emailService.js     # Resend integration
│   │   │   └── wishlistService.js
│   │   ├── utils/            # Helpers (order ID generation)
│   │   ├── app.js            # Express app (CORS, routes, health probes)
│   │   └── server.js         # Server bootstrap
│   ├── database/             # Raw SQL reference files
│   ├── migrate.js            # DB migration script
│   ├── seed_50_products.js   # Product seeding script
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI (Navbar, Footer, ProductCard, ProtectedRoute)
│   │   ├── context/          # AuthContext (React Context API)
│   │   ├── pages/            # Route-level views
│   │   │   ├── Home.jsx          # SWR-cached homepage with banner gallery
│   │   │   ├── Products.jsx      # Filterable product catalog
│   │   │   ├── ProductDetail.jsx # Full product page
│   │   │   ├── Cart.jsx          # Cart with Stripe checkout
│   │   │   ├── Wishlist.jsx
│   │   │   ├── Orders.jsx        # Order history
│   │   │   ├── CheckoutSuccess.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/         # Axios API module with JWT interceptor
│   │   ├── utils/            # Image CDN optimiser
│   │   ├── App.jsx           # Root component + routing
│   │   └── main.jsx          # Vite entry point
│   ├── package.json
│   └── vite.config.js
│
├── PRD.md                    # Product Requirements Document
└── README.md                 # ← You are here
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** v12+ (or a [Neon](https://neon.tech) serverless instance)
- **Stripe Account** — [Get API keys](https://dashboard.stripe.com/apikeys)
- **Resend Account** *(optional)* — [Get API key](https://resend.com) for order emails

### 1. Clone the Repository

```bash
git clone https://github.com/Saransh2412/shopsphere.git
cd shopsphere
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database (PostgreSQL / Neon)
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# Auth
JWT_SECRET=your_super_secret_jwt_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# Email (optional)
RESEND_API_KEY=re_...

# CORS (production only — comma-separated frontend origins)
FRONTEND_URL=https://your-frontend.vercel.app
```

Run migrations and seed data:

```bash
node migrate.js
node seed_50_products.js
```

Start the development server:

```bash
npm run dev    # Starts with nodemon (auto-reload)
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` *(optional for local dev)*:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev    # Opens at http://localhost:5173
```

---

## 🌐 Deployment

### Backend → [Render](https://render.com)

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon connection string |
| `JWT_SECRET` | Strong random string |
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` |
| `RESEND_API_KEY` | `re_...` |
| `FRONTEND_URL` | `https://your-app.vercel.app` |
| `NODE_ENV` | `production` |

### Frontend → [Vercel](https://vercel.com)

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-api.onrender.com/api` |

### Uptime Monitoring

Configure an uptime monitor (e.g., UptimeRobot, Better Uptime) to ping:

```
GET https://your-api.onrender.com/health   (every 5 min, timeout 30s)
```

This keeps the Render free-tier instance warm without touching the database.

---

## 🧪 Testing the API

Import the Postman collection and set the `baseUrl` variable:

```bash
# Quick smoke test
curl -i http://localhost:5000/health
curl -i http://localhost:5000/api/products?page=1&limit=5
```

---

## 📊 Performance Highlights

| Metric | Value | How |
|--------|-------|-----|
| Perceived TTFB (returning user) | **~0 ms** | localStorage SWR cache renders cached products instantly |
| Image bandwidth reduction | **Up to 80%** | wsrv.nl CDN converts to WebP + resizes on the edge |
| Cold-start recovery UX | **< 3 s** | "Waking up server…" toast after 2.5 s, skeleton loaders throughout |
| Order creation atomicity | **100%** | Sequelize transaction with row-level locking and rollback |

---

## 🛣️ Roadmap

- [ ] Admin dashboard — product CRUD, order management, analytics
- [ ] Reviews & ratings — star ratings, text reviews, per-product averages
- [ ] Full-text search — Elasticsearch / pg_trgm for fuzzy matching
- [ ] Redis caching — replace in-memory cache for multi-instance scaling
- [ ] Stripe Webhooks — replace client-side session verification for reliability
- [ ] CI/CD pipeline — GitHub Actions for automated testing & deployment

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
  Built with ☕ by <strong>Saransh Sethi</strong>
</p>
