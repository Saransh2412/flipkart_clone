const express = require('express');
const { getWishlistItems, addItemToWishlist, removeItemFromWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All wishlist routes require authentication

router.route('/')
  .get(getWishlistItems)
  .post(addItemToWishlist);

router.delete('/:id', removeItemFromWishlist);

module.exports = router;
