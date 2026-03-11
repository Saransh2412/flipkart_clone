const { sequelize, Order, OrderItem, CartItem, Product, User } = require('../models');
const { generateOrderId } = require('../utils/generateOrderId');
const { sendOrderConfirmationEmail } = require('./emailService');

const placeOrder = async (userId, shippingAddress) => {
  const t = await sequelize.transaction();

  try {
    // 1. Get cart items
    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
      include: [{ model: Product, as: 'product' }],
      transaction: t
    });

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    let totalPrice = 0;
    cartItems.forEach(item => {
      totalPrice += Number(item.product.price) * item.quantity;
    });

    // 2. Create Order
    const orderId = generateOrderId();
    await Order.create({
      id: orderId,
      user_id: userId,
      total_price: totalPrice,
      shipping_address: shippingAddress,
      status: 'Pending'
    }, { transaction: t });

    // 3. Insert Order Items & Verify Stock
    for (const item of cartItems) {
      const prod = await Product.findByPk(item.product_id, { lock: true, transaction: t });
      if (prod.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ID ${item.product_id}`);
      }

      await OrderItem.create({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: prod.price
      }, { transaction: t });

      prod.stock -= item.quantity;
      await prod.save({ transaction: t });
    }

    // 4. Clear Cart
    await CartItem.destroy({
      where: { user_id: userId },
      transaction: t
    });

    await t.commit();

    // 5. Send Email (fire-and-forget — never blocks or fails the order)
    const itemDetails = cartItems.map(item => ({
      name: item.product.name,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    User.findByPk(userId)
      .then(userRow => {
        if (userRow && userRow.email) {
          sendOrderConfirmationEmail(userRow.email, orderId, totalPrice, itemDetails);
        }
      })
      .catch(err => console.error('⚠️ Email lookup failed:', err.message));

    return { orderId, totalPrice, status: 'Pending' };

  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const getUserOrders = async (userId) => {
  return await Order.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']]
  });
};

const getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({
    where: { id: orderId, user_id: userId },
    include: [{
      model: OrderItem,
      as: 'items',
      include: [{ model: Product, as: 'product', attributes: ['name'] }]
    }]
  });

  if (!order) throw new Error('Order not found');

  const mappedOrder = order.toJSON();
  mappedOrder.items = mappedOrder.items.map(i => {
    return {
      id: i.id,
      order_id: i.order_id,
      product_id: i.product_id,
      quantity: i.quantity,
      price: i.price,
      name: i.product ? i.product.name : null
    };
  });

  return mappedOrder;
};

module.exports = {
  placeOrder,
  getUserOrders,
  getOrderById,
};
