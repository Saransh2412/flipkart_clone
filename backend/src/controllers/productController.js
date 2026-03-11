const productService = require('../services/productService');

const getProducts = async (req, res, next) => {
  try {
    const { page, limit, search, category } = req.query;
    const productsData = await productService.getAllProducts(
      page || 1,
      limit || 10,
      search || '',
      category || ''
    );
    res.json(productsData);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
};
