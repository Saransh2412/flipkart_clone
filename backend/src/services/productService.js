const { Op } = require('sequelize');
const { Product, Category, ProductImage } = require('../models');

const getAllProducts = async (page = 1, limit = 10, search = '', category = '') => {
  const customLimit = parseInt(limit, 10);
  const customPage = parseInt(page, 10);
  const offset = (customPage - 1) * customLimit;

  let whereClause = {};
  if (search) {
    whereClause.name = { [Op.iLike]: `%${search}%` };
  }

  let includeClause = [
    { model: ProductImage, as: 'images', attributes: ['image_url'] }
  ];

  if (category) {
    includeClause.push({
      model: Category,
      as: 'category',
      where: { name: { [Op.iLike]: `%${category}%` } }
    });
  } else {
    includeClause.push({ model: Category, as: 'category' });
  }

  const { count, rows } = await Product.findAndCountAll({
    where: whereClause,
    include: includeClause,
    limit: customLimit,
    offset: offset,
    order: [['created_at', 'DESC']],
    distinct: true
  });

  // format response to match previous JSON shape so API tests pass perfectly
  const products = rows.map(p => {
    return {
      id: p.id,
      category_id: p.category_id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      created_at: p.created_at,
      category_name: p.category ? p.category.name : null,
      images: p.images ? p.images.map(img => img.image_url) : []
    };
  });

  return {
    products,
    total: count,
    page: customPage,
    pages: Math.ceil(count / customLimit),
  };
};

const getProductById = async (id) => {
  const p = await Product.findOne({
    where: { id },
    include: [
      { model: Category, as: 'category' },
      { model: ProductImage, as: 'images', attributes: ['image_url'] }
    ]
  });

  if (!p) throw new Error('Product not found');

  return {
    id: p.id,
    category_id: p.category_id,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    created_at: p.created_at,
    category_name: p.category ? p.category.name : null,
    images: p.images ? p.images.map(img => img.image_url) : []
  };
};

module.exports = {
  getAllProducts,
  getProductById,
};
