const express = require('express');
const { getCartContents, addItemToCart, updateCartItem, removeCartItem } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All cart routes require authentication

router.route('/')
  .get(getCartContents)
  .post(addItemToCart);

router.route('/:id')
  .put(updateCartItem)
  .delete(removeCartItem);

module.exports = router;
