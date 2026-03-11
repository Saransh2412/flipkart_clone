const express = require('express');
const { placeNewOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All order routes require authentication

router.route('/')
  .post(placeNewOrder)
  .get(getMyOrders);

router.get('/:id', getOrderById);

module.exports = router;
