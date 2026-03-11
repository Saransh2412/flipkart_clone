const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ProductImage = sequelize.define('ProductImage', {
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  image_url: { type: DataTypes.TEXT, allowNull: false }
}, {
  tableName: 'product_images',
  timestamps: false
});

module.exports = ProductImage;
