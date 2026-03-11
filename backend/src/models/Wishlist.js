const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Wishlist = sequelize.define('Wishlist', {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'wishlist',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['user_id', 'product_id'] }
  ]
});

module.exports = Wishlist;
