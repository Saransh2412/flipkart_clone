const wishlistService = require('../services/wishlistService');

const getWishlistItems = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.getWishlist(req.user.id);
    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

const addItemToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      res.status(400);
      throw new Error('Product ID is required');
    }

    const item = await wishlistService.addToWishlist(req.user.id, productId);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const removeItemFromWishlist = async (req, res, next) => {
  try {
    const result = await wishlistService.removeFromWishlist(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

module.exports = {
  getWishlistItems,
  addItemToWishlist,
  removeItemFromWishlist,
};
