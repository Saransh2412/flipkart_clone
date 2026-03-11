const orderService = require('../services/orderService');

const placeNewOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;
    if (!shippingAddress) {
      res.status(400);
      throw new Error('Shipping address is required');
    }

    const order = await orderService.placeOrder(req.user.id, shippingAddress);
    res.status(201).json(order);
  } catch (error) {
    if (error.message === 'Cart is empty' || error.message.includes('Insufficient stock')) {
      res.status(400);
    }
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.id);
    res.json(order);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

module.exports = {
  placeNewOrder,
  getMyOrders,
  getOrderById,
};
