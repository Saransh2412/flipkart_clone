const { Wishlist, Product, ProductImage } = require('../models');

const getWishlist = async (userId) => {
  const items = await Wishlist.findAll({
    where: { user_id: userId },
    include: [{
      model: Product,
      as: 'product',
      include: [{ model: ProductImage, as: 'images' }]
    }]
  });

  return items.map(w => {
    return {
      wishlist_id: w.id,
      id: w.product.id,
      category_id: w.product.category_id,
      name: w.product.name,
      description: w.product.description,
      price: w.product.price,
      stock: w.product.stock,
      created_at: w.product.created_at,
      image: (w.product.images && w.product.images.length > 0) ? w.product.images[0].image_url : ''
    };
  });
};

const addToWishlist = async (userId, productId) => {
  try {
    const [item, created] = await Wishlist.findOrCreate({
      where: { user_id: userId, product_id: productId }
    });
    
    if (!created) {
      return { message: 'Already in wishlist' };
    }
    
    return item;
  } catch (error) {
    throw error;
  }
};

const removeFromWishlist = async (wishlistId, userId) => {
  const result = await Wishlist.destroy({
    where: { id: wishlistId, user_id: userId }
  });
  
  if (result === 0) throw new Error('Wishlist item not found');
  
  return { message: 'Item removed from wishlist' };
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
