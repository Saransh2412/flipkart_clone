const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CartItem = sequelize.define('CartItem', {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, {
  tableName: 'cart_items',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['user_id', 'product_id'] }
  ]
});

module.exports = CartItem;
