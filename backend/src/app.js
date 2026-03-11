const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// We will mount routes here
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/images', require('./routes/imageRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('Flipkart Backend API is running...');
});

app.get("/health",(req,res)=>{
  res.status(200).json({message:"SERVER HEALTHY !!!"})  
})
// Error handling middleware
app.use(errorHandler);

module.exports = app;
