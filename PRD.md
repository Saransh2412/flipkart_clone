# ShopSphere — Product Requirements Document (PRD)

**Version:** 1.0  
**Author:** Saransh Sethi  
**Last Updated:** April 2026  
**Status:** Production (Live)

---

## 1. Overview

**ShopSphere** is a production-grade, full-stack e-commerce platform built from scratch to demonstrate end-to-end proficiency in modern web development — from database design and API architecture to payment processing and deployment.

The platform delivers a complete online shopping experience: users can browse a categorised product catalog, manage carts and wishlists, checkout with real Stripe payments, receive transactional order-confirmation emails, and track their order history — all behind a responsive, performance-optimised React frontend.

---

## 2. Goals & Objectives

| # | Goal | Success Metric |
|---|------|----------------|
| G1 | Deliver a fully functional e-commerce user journey (browse → cart → pay → confirm) | End-to-end order placement with Stripe succeeds < 5 s |
| G2 | Demonstrate production-level backend architecture (layered services, ORM, transactions) | Clean separation across Routes → Controllers → Services → Models |
| G3 | Achieve fast perceived performance on commodity hosting | TTFB < 200 ms for cached pages; 0 ms perceived load for returning users via SWR |
| G4 | Ensure PCI-compliant payment handling | Zero credit-card data touches the server — Stripe Checkout handles all PCI scope |
| G5 | Production deployment with observability | Health + readiness endpoints, request logging, uptime monitoring |

---

## 3. Target Users

| Persona | Description |
|---------|-------------|
| **Shopper** | End user who browses, adds items to cart/wishlist, and completes purchases |
| **Recruiter / Reviewer** | Technical evaluator reviewing the project for code quality, architecture, and feature depth |

---

## 4. Features & Functional Requirements

### 4.1 Authentication & User Management

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-1 | User registration with name, email, password, and optional address | P0 |
| AUTH-2 | User login returning a signed JWT (24 h expiry) | P0 |
| AUTH-3 | Password hashing via bcryptjs (never stored in plaintext) | P0 |
| AUTH-4 | JWT-based route protection for cart, wishlist, orders, and profile | P0 |
| AUTH-5 | Profile update (shipping address) | P1 |
| AUTH-6 | Persistent session — token + user data stored in localStorage, rehydrated on refresh | P1 |

### 4.2 Product Catalog

| ID | Requirement | Priority |
|----|-------------|----------|
| PROD-1 | Paginated product listing with server-side offset/limit | P0 |
| PROD-2 | Category-based filtering (case-insensitive `iLike`) | P0 |
| PROD-3 | Free-text product search (name, case-insensitive) | P0 |
| PROD-4 | Individual product detail page with image gallery, description, price, stock status | P0 |
| PROD-5 | Multi-image support per product (1-to-Many `ProductImage` relation) | P1 |
| PROD-6 | Visual category icon navigation bar | P1 |

### 4.3 Shopping Cart

| ID | Requirement | Priority |
|----|-------------|----------|
| CART-1 | Add product to cart (with quantity) | P0 |
| CART-2 | Update item quantity in cart | P0 |
| CART-3 | Remove individual item from cart | P0 |
| CART-4 | View cart with computed line-item and aggregate totals | P0 |
| CART-5 | Cart state persisted in database (survives logout / device switch) | P0 |
| CART-6 | Real-time cart badge count in navbar (via custom `cartUpdated` events) | P1 |

### 4.4 Wishlist

| ID | Requirement | Priority |
|----|-------------|----------|
| WISH-1 | Add / remove products from wishlist | P0 |
| WISH-2 | View all wishlisted products | P0 |
| WISH-3 | Move wishlist item to cart | P1 |

### 4.5 Checkout & Payments (Stripe)

| ID | Requirement | Priority |
|----|-------------|----------|
| PAY-1 | Generate Stripe Checkout Session from cart contents (INR currency) | P0 |
| PAY-2 | Redirect user to Stripe-hosted checkout (PCI-compliant — zero card data on our server) | P0 |
| PAY-3 | On success redirect, verify session with Stripe API server-side | P0 |
| PAY-4 | Idempotent order fulfillment — in-memory `processedSessions` Set prevents double-processing | P0 |
| PAY-5 | Shipping address collected via Stripe's built-in address form | P1 |
| PAY-6 | Graceful handling of duplicate verify calls (returns success, not error) | P1 |

### 4.6 Order Management

| ID | Requirement | Priority |
|----|-------------|----------|
| ORD-1 | Create order from cart within a Sequelize transaction (atomic: order + items + stock decrement + cart clear) | P0 |
| ORD-2 | Stock verification with row-level locking (`SELECT … FOR UPDATE`) | P0 |
| ORD-3 | Custom order ID generation | P1 |
| ORD-4 | View order history (most recent first) | P0 |
| ORD-5 | View individual order detail with line items | P1 |

### 4.7 Transactional Emails

| ID | Requirement | Priority |
|----|-------------|----------|
| EMAIL-1 | Send order-confirmation email on successful checkout via Resend API | P1 |
| EMAIL-2 | Rich HTML email template with order summary table | P1 |
| EMAIL-3 | Fire-and-forget pattern — email failure never blocks or rolls back the order | P0 |

### 4.8 Performance Optimizations

| ID | Requirement | Priority |
|----|-------------|----------|
| PERF-1 | **Client-side SWR cache** — homepage products loaded from `localStorage` instantly, then silently refreshed from API | P0 |
| PERF-2 | **Edge CDN image optimization** — all product images routed through `wsrv.nl` (Cloudflare) with on-the-fly WebP conversion + 31-day cache | P0 |
| PERF-3 | **In-memory API cache** on heavily-trafficked default product queries | P1 |
| PERF-4 | **Connection pooling** — Sequelize pool (max 5, idle 10 s) to minimise serverless cold-start overhead | P1 |
| PERF-5 | "Waking up server" UX — if API takes > 2.5 s, a friendly message tells the user the server is starting | P2 |

### 4.9 Deployment & Observability

| ID | Requirement | Priority |
|----|-------------|----------|
| DEP-1 | Backend deployed on Render (Node.js) | P0 |
| DEP-2 | Frontend deployed on Vercel (static Vite build) | P0 |
| DEP-3 | PostgreSQL hosted on Neon (serverless Postgres) | P0 |
| DEP-4 | `GET /health` — lightweight liveness probe (no DB hit, 0% compute cost) | P0 |
| DEP-5 | `GET /ready` — readiness probe with 24-hour DB-status cache to prevent quota exhaustion | P0 |
| DEP-6 | Structured request logging (method, path, status, duration, origin, CF-Ray, Render request ID) | P1 |
| DEP-7 | Multi-origin CORS configuration (env-driven `FRONTEND_URL`, comma-separated) | P0 |

---

## 5. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Security** | Passwords hashed with bcryptjs; JWT auth on all protected routes; CORS whitelisting; Stripe handles PCI compliance |
| **Scalability** | Stateless API (horizontally scalable); connection pooling; in-memory caching layer |
| **Reliability** | Atomic transactions with rollback on failure; idempotent payment verification; graceful email degradation |
| **Performance** | 0 ms perceived TTFB for returning users (SWR); CDN-optimised images (up to 80% bandwidth reduction); skeleton loading states |
| **Maintainability** | Layered architecture (Routes → Controllers → Services → Models); Sequelize ORM; environment-driven configuration |

---

## 6. Data Model (Entity Relationships)

```
┌──────────┐       ┌────────────┐       ┌───────────┐
│   User   │──1:N──│  CartItem   │──N:1──│  Product   │
│          │──1:N──│  Wishlist   │──N:1──│           │
│          │──1:N──│   Order     │       │           │
└──────────┘       └────────────┘       └───────────┘
                         │ 1:N                │ 1:N
                   ┌─────┴──────┐       ┌─────┴──────┐
                   │ OrderItem  │──N:1──│           │
                   └────────────┘       │           │
                                        │  Category  │──1:N──Product
                                        └────────────┘
                                        ┌────────────┐
                                Product──1:N──│ProductImage│
                                        └────────────┘
```

**Key Relationships:**
- `User` → `CartItem`, `Wishlist`, `Order` (1-to-Many)
- `Category` → `Product` (1-to-Many)
- `Product` → `ProductImage` (1-to-Many, CASCADE delete)
- `Order` → `OrderItem` (1-to-Many, CASCADE delete)
- `OrderItem` → `Product` (Many-to-1, RESTRICT delete — preserves order history)

---

## 7. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, Vite, React Router DOM | SPA with client-side routing |
| **State** | React Context API | Auth state management |
| **HTTP** | Axios (with JWT interceptor) | API communication |
| **Styling** | Vanilla CSS (component-scoped) | UI design |
| **Backend** | Node.js, Express 5 | RESTful API server |
| **ORM** | Sequelize 6 | Database modelling + migrations |
| **Database** | PostgreSQL (Neon) | Relational data persistence |
| **Payments** | Stripe Checkout Sessions | PCI-compliant payment processing |
| **Email** | Resend API | Transactional order confirmations |
| **Image CDN** | wsrv.nl (Cloudflare Edge) | On-the-fly WebP conversion + caching |
| **Hosting** | Render (API) + Vercel (Frontend) | Production deployment |

---

## 8. API Surface

| Domain | Method | Endpoint | Auth | Description |
|--------|--------|----------|------|-------------|
| Auth | `POST` | `/api/auth/signup` | No | Register new user |
| Auth | `POST` | `/api/auth/login` | No | Login, returns JWT |
| Auth | `PUT` | `/api/auth/profile` | Yes | Update profile/address |
| Products | `GET` | `/api/products` | No | List products (paginated, searchable, filterable) |
| Products | `GET` | `/api/products/:id` | No | Product detail |
| Cart | `GET` | `/api/cart` | Yes | View cart |
| Cart | `POST` | `/api/cart` | Yes | Add item to cart |
| Cart | `PUT` | `/api/cart/:id` | Yes | Update quantity |
| Cart | `DELETE` | `/api/cart/:id` | Yes | Remove item |
| Wishlist | `GET` | `/api/wishlist` | Yes | View wishlist |
| Wishlist | `POST` | `/api/wishlist` | Yes | Add to wishlist |
| Wishlist | `DELETE` | `/api/wishlist/:id` | Yes | Remove from wishlist |
| Orders | `GET` | `/api/orders` | Yes | Order history |
| Orders | `GET` | `/api/orders/:id` | Yes | Order detail |
| Orders | `POST` | `/api/orders` | Yes | Place order (direct) |
| Stripe | `POST` | `/api/stripe/create-checkout-session` | Yes | Create Stripe session |
| Stripe | `POST` | `/api/stripe/verify-session` | Yes | Verify & fulfill order |
| System | `GET` | `/health` | No | Liveness probe |
| System | `GET` | `/ready` | No | Readiness probe (24 h cached DB check) |

---

## 9. Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                    │
│  React 19 + Vite │ SWR Cache │ wsrv.nl CDN images       │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS (Axios + JWT)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   API SERVER (Render)                     │
│  Express 5 │ CORS │ Request Logging │ Health Probes       │
│                                                           │
│  ┌─────────┐  ┌──────────────┐  ┌───────────────┐       │
│  │ Routes  │→ │ Controllers  │→ │   Services    │       │
│  └─────────┘  └──────────────┘  └───────┬───────┘       │
│                                          │               │
│           ┌──────────────────────────────┼────────┐      │
│           │         Sequelize ORM        │        │      │
│           │  ┌────────────────────────┐  │        │      │
│           │  │       Models           │  │        │      │
│           │  │ User│Product│Order│... │  │        │      │
│           │  └────────────────────────┘  │        │      │
│           └──────────────────────────────┘        │      │
└──────────────────────┬───────────────┬────────────┘      │
                       │               │                    
                       ▼               ▼                    
              ┌────────────┐   ┌──────────────┐            
              │ PostgreSQL │   │   Stripe API │            
              │   (Neon)   │   │   (Payments) │            
              └────────────┘   └──────────────┘            
                                       │                    
                               ┌───────┴───────┐           
                               │  Resend API   │           
                               │  (Emails)     │           
                               └───────────────┘           
```

---

## 10. Future Roadmap

| Phase | Feature | Notes |
|-------|---------|-------|
| v1.1 | Admin dashboard (product CRUD, order management) | Role-based access control |
| v1.2 | Product reviews & ratings | Star ratings, text reviews, average computation |
| v1.3 | Full-text search with Elasticsearch | Replace `iLike` with inverted index |
| v1.4 | Redis caching layer | Replace in-memory cache for multi-instance deployments |
| v1.5 | Webhook-based payment confirmation | Replace polling with Stripe webhooks for reliability |

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Render free-tier cold starts (30 s spin-up) | Poor first-load UX | SWR cache + "Waking up server" message after 2.5 s |
| Neon DB compute quotas exhausted | 503 errors | Health endpoint avoids DB; readiness caches DB status for 24 h |
| In-memory idempotency set lost on restart | Potential double-order | Stripe session ID stored in Order table as unique constraint (DB-level backup) |
| Email service outage | User doesn't receive confirmation | Fire-and-forget with `catch` — order always succeeds regardless |
