const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware — support multiple origins (comma-separated FRONTEND_URL)
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://flipkart-clone-hazel-nu.vercel.app',
  'https://flipkart-clone.saranshh.me'
];

const allowedOrigins = Array.from(
  new Set(
    (process.env.FRONTEND_URL || '')
      .split(',')
      .map((origin) => origin.trim().replace(/\/$/, ''))
      .filter(Boolean)
      .concat(defaultOrigins)
  )
);

app.use(cors({
  origin: function (origin, callback) {
    const normalizedOrigin = origin ? origin.replace(/\/$/, '') : origin;
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Lightweight request logging for production incident debugging.
const requestLoggingEnabled = process.env.REQUEST_LOGGING !== 'false';
if (requestLoggingEnabled) {
  app.use((req, res, next) => {
    const startTime = process.hrtime.bigint();

    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;
      const cfRay = req.headers['cf-ray'] || '-';
      const renderRequestId = req.headers['x-render-request-id'] || '-';
      const origin = req.headers.origin || '-';

      console.log(
        `[REQ] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(1)}ms origin=${origin} cfRay=${cfRay} renderReqId=${renderRequestId}`
      );
    });

    next();
  });
}

// Routes
// We will mount routes here
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/images', require('./routes/imageRoutes'));
app.use('/api/stripe', require('./routes/stripeRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('Flipkart Backend API is running...');
});

// HEALTH CHECK: Used by Uptime Bots (every 5-10 min). 
// This NEVER touches the database. 0% Compute cost.
app.get("/health", (req, res) => {
  res.status(200).json({ message: "SERVER HEALTHY !!!" });
});

// READINESS CHECK: Only pings the database once every 24 hours.
let dbStatusCache = { status: 'unknown', timestamp: 0 };
app.get('/ready', async (req, res) => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();

  // If cache is fresh (less than 24h old), return cached status
  if (dbStatusCache.status !== 'unknown' && (now - dbStatusCache.timestamp < ONE_DAY_MS)) {
    return res.status(200).json({
      message: 'SERVER READY (cached)',
      db: dbStatusCache.status,
      nextCheckIn: Math.round((ONE_DAY_MS - (now - dbStatusCache.timestamp)) / 1000 / 60) + " mins"
    });
  }

  // Otherwise, do a real check
  try {
    await sequelize.authenticate();
    dbStatusCache = { status: 'up', timestamp: now };
    res.status(200).json({ message: 'SERVER READY (live check)', db: 'up' });
  } catch (error) {
    // If it fails, don't cache 'up', just return error
    res.status(503).json({ message: 'SERVER NOT READY', db: 'down', error: error.message });
  }
});

// INTERNAL DB CHECK: Use only for manual verification
app.get('/api/status/db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'disconnected', error: error.message });
  }
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
