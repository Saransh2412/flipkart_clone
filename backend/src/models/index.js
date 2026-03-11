const { sequelize } = require('../config/db');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Wishlist = require('./Wishlist');

// Category & Product
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Product & ProductImage
Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images', onDelete: 'CASCADE' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// User & CartItem
User.hasMany(CartItem, { foreignKey: 'user_id', as: 'cartItems', onDelete: 'CASCADE' });
CartItem.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Product & CartItem
Product.hasMany(CartItem, { foreignKey: 'product_id', as: 'cartItems', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// User & Order
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Order & OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Product & OrderItem
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems', onDelete: 'RESTRICT' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// User & Wishlist
User.hasMany(Wishlist, { foreignKey: 'user_id', as: 'wishlistItems', onDelete: 'CASCADE' });
Wishlist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Product & Wishlist
Product.hasMany(Wishlist, { foreignKey: 'product_id', as: 'wishlistItems', onDelete: 'CASCADE' });
Wishlist.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  ProductImage,
  CartItem,
  Order,
  OrderItem,
  Wishlist
};
