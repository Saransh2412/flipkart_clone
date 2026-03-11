const cartService = require('../services/cartService');

const getCartContents = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const addItemToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      res.status(400);
      throw new Error('Product ID and quantity are required');
    }

    const cartItem = await cartService.addToCart(req.user.id, productId, quantity);
    res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cartItem = await cartService.updateCartQuantity(req.params.id, req.user.id, quantity);
    res.json(cartItem);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const result = await cartService.removeFromCart(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

module.exports = {
  getCartContents,
  addItemToCart,
  updateCartItem,
  removeCartItem,
};
