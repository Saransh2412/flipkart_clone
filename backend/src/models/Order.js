const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.STRING(50), primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  shipping_address: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING(50), defaultValue: 'Pending' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'orders',
  timestamps: false
});

module.exports = Order;
