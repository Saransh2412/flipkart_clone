const { CartItem, Product, ProductImage } = require('../models');

const getCart = async (userId) => {
  const items = await CartItem.findAll({
    where: { user_id: userId },
    include: [{
      model: Product,
      as: 'product',
      include: [{ model: ProductImage, as: 'images' }]
    }]
  });

  return items.map(c => {
    return {
      cart_item_id: c.id,
      quantity: c.quantity,
      id: c.product.id,
      category_id: c.product.category_id,
      name: c.product.name,
      description: c.product.description,
      price: c.product.price,
      stock: c.product.stock,
      created_at: c.product.created_at,
      image: (c.product.images && c.product.images.length > 0) ? c.product.images[0].image_url : ''
    };
  });
};


const addToCart = async (userId, productId, quantity) => {
  const customQty = parseInt(quantity, 10);

  // Check if item already in cart
  const exists = await CartItem.findOne({
    where: { user_id: userId, product_id: productId }
  });

  if (exists) {
    exists.quantity += customQty;
    await exists.save();
    return exists;
  } else {
    const newItem = await CartItem.create({
      user_id: userId,
      product_id: productId,
      quantity: customQty
    });
    return newItem;
  }
};

const updateCartQuantity = async (cartItemId, userId, quantity) => {
  const cartItem = await CartItem.findOne({
    where: { id: cartItemId, user_id: userId }
  });

  if (!cartItem) throw new Error('Cart item not found');

  cartItem.quantity = parseInt(quantity, 10);
  await cartItem.save();
  
  return cartItem;
};

const removeFromCart = async (cartItemId, userId) => {
  const result = await CartItem.destroy({
    where: { id: cartItemId, user_id: userId }
  });
  
  if (result === 0) throw new Error('Cart item not found');
  
  return { message: 'Item removed from cart' };
};

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
};
