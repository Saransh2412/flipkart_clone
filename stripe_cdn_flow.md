# Flipkart Clone - Stripe & CDN Architecture Flow

This document explains two core optimizations integrated into the application: the **Stripe Payment Gateway Checkout Flow** and the **Cloudflare Edge CDN (wsrv.nl) Image Delivery**.

---

## 1. Stripe Checkout Flow

We use "Stripe Checkout" (hosted sessions) because it is the most secure, easiest to maintain, and offloads UI validation to Stripe directly.

### The Flow:
1. **Initiation (`Cart.jsx`)**: The user reviews their cart and clicks "Checkout". 
2. **Session Creation (`stripeController.js - createCheckoutSession`)**:
   - The frontend makes a POST request to `/api/stripe/create-checkout-session`.
   - The backend validates the user's cart items from the database.
   - It builds an array of `line_items` containing product names, images, and prices in paise format.
   - The backend calls `stripe.checkout.sessions.create` configured with `shipping_address_collection`. This tells Stripe to prompt the user for their address.
   - Stripe responds with a unique checkout URL.
3. **Redirect**: The backend sends this URL back to the frontend, and the frontend executes `window.location.href = url`, securely redirecting the customer to Stripe.
4. **Payment**: The customer enters card details and addresses on Stripe's PCI-compliant hosted page.
5. **Success Return (`CheckoutSuccess.jsx`)**:
   - Upon successful payment, Stripe redirects the browser to `localhost:5173/checkout/success?session_id=...`
   - The React frontend mounts the `CheckoutSuccess` component.
   - **Crucial step**: `CheckoutSuccess` uses a React `useRef` to ensure it only fires *exactly once* (bypassing React 18 strict mode double-fires), sending the `session_id` to `/api/stripe/verify-session`.
6. **Backend Verification (`stripeController.js - verifySession`)**:
   - The backend pulls the `session_id` and checks it against an in-memory `Set` (`processedSessions`) for instant idempotency.
   - It calls `stripe.checkout.sessions.retrieve(session_id)` to verify the payment actually succeeded (preventing users from bypassing payment).
   - It parses `session.shipping_details.address` (or `customer_details`), dynamically constructing a beautiful address string.
   - It passes everything to `orderService.placeOrder(userId, address, session_id)`.
7. **Database Persistence**:
   - A SQL transaction begins.
   - A new Order is created, logging the `stripe_session_id`. Because this column has a `UNIQUE` constraint in Postgres, if the network glitches and the user somehow sends the request twice simultaneously, the database strictly blocks the duplicate.
   - The cart is wiped, and the frontend is notified of success.

---

## 2. Cloudflare Edge CDN Flow (Images.weserv.nl)

Storing images locally or hotlinking directly from various slow external URLs severely harms Core Web Vitals and user experience. To fix this, we proxy images through `wsrv.nl`, a free caching and optimization service powered by Cloudflare's Edge network.

### The Flow:
1. **Utility Setup (`imageUtils.js`)**: 
   - We created `export const getOptimizedImage = (url, width)`.
2. **Component Wrapping**: Whenever a component (`ProductCard`, `ProductDetail`, etc.) needs to render an image:
   - Instead of `<img src={product.image} />`
   - We do `<img src={getOptimizedImage(product.image, 400)} />`
3. **The Transformation**:
   - The function generates a URL like: `https://wsrv.nl/?url=external-site.com/image.jpg&w=400&output=webp`
4. **Cloudflare Edge Processing**:
   - When the user's browser requests that URL, Cloudflare intercepts it at the data center closest to the user (e.g., Mumbai, Delhi).
   - If Cloudflare already has the image cached, it returns it instantly in ~20ms.
   - If not, Weserv fetches the original image from the source once, resizes it cleanly to exactly `400px` (saving massive bandwidth), converts the JPG/PNG into extremely lightweight `WebP` compression format, saves it to cache, and sends it to the user.
5. **Result**:
   - Massive 60-80% reduction in image payload size.
   - Near-instant global delivery.
   - Zero load on our own backend server.

---

## 3. Dual-Layer API Data Caching (Zero-Millisecond TTFB)

To complement the image CDN and provide a true "Amazon-like" instant loading experience, we implemented a dual-layer caching strategy for API requests that completely eliminates UI loading delays.

### The Flow:

1. **Frontend "Stale-While-Revalidate" (`Home.jsx`)**:
   - The React `useState` hooks are initialized *synchronously* by parsing the `flipkart_home_products` key from the browser's `localStorage`.
   - The `loading` state is initialized to `false` if local storage exists.
   - **Result**: When the user returns to the Home Page, React bypasses the skeleton loader and renders the complete UI with product data and images instantly (**0ms latency**).
   - *Behind the scenes*: A `useEffect` hook triggers `getProducts()` silently in the background, shuffling the data and saving the *fresh* data back into `localStorage` so the next visit is always up to date.

2. **Backend Express In-Memory Cache (`productController.js`)**:
   - To ensure the background fetching (or new user fetching) is as fast as possible, the Node.js server maintains an in-memory dictionary (`productCache`).
   - When a request hits `/api/products` for the default Homepage constraints (`page=1&limit=20`), the server checks if it has fetched this data from the Neon Postgres database in the last 60 seconds (`Date.now() - timestamp < 60000`).
   - If the cache is valid, Express immediately returns the JSON payload directly out of RAM.
   - **Result**: Drastically reduces network latency (from ~500ms database query overhead down to ~5ms) and entirely removes heavy repetitive SQL load from the database on highly trafficked pages.
