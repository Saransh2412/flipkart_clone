const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { CartItem, Product, User } = require('../models');

const createCheckoutSession = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user's cart
    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
      include: [{ model: Product, as: 'product' }]
    });

    if (!cartItems || cartItems.length === 0) {
      res.status(400);
      throw new Error('Cart is empty');
    }

    const lineItems = cartItems.map(item => {
      // Ensure we have a valid price (in cents/paise for INR)
      const unitAmount = Math.round(Number(item.product.price) * 100);

      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.product.name,
            images: item.product.image ? [item.product.image] : [],
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    const frontendUrls = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');
    const primaryFrontendUrl = frontendUrls[0].trim();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['IN', 'US', 'GB'], // Add more as needed
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: `${primaryFrontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${primaryFrontendUrl}/cart`,
      client_reference_id: userId.toString(),
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
};

const processedSessions = new Set();
const verifySession = async (req, res, next) => {
  try {
    const { session_id } = req.body;
    const userId = req.user.id;

    if (!session_id) {
      res.status(400);
      throw new Error('Session ID is required');
    }

    if (processedSessions.has(session_id)) {
      return res.json({ success: true, message: 'Order already processed' });
    }
    processedSessions.add(session_id);

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      res.status(400);
      throw new Error('Payment not completed');
    }

    // Double check it's for the current user
    if (session.client_reference_id !== userId.toString()) {
      res.status(403);
      throw new Error('Session does not belong to user');
    }

    // Extract shipping address
    let shippingAddress = 'Address not provided';
    const sourceAddress = session.shipping_details?.address || session.customer_details?.address;
    const name = session.shipping_details?.name || session.customer_details?.name || '';

    if (sourceAddress) {
      const addrList = [
        name,
        sourceAddress.line1,
        sourceAddress.line2,
        sourceAddress.city,
        sourceAddress.state,
        sourceAddress.postal_code,
        sourceAddress.country
      ].filter(Boolean);
      shippingAddress = addrList.join(', ').trim();
    }

    // Call order service to fulfill order
    const orderService = require('../services/orderService');
    const order = await orderService.placeOrder(userId, shippingAddress, session_id);

    res.json({ success: true, order });
  } catch (error) {
    // If cart is already empty or unique constraint fails, handle it gracefully
    if (error.message === 'Cart is empty' || error.name === 'SequelizeUniqueConstraintError') {
       return res.json({ success: true, message: 'Order already processed' });
    }
    next(error);
  }
};

module.exports = {
  createCheckoutSession,
  verifySession
};
