const productService = require('../services/productService');

// In-memory cache for API payloads
let productCache = {
  data: null,
  timestamp: 0,
};

const getProducts = async (req, res, next) => {
  try {
    const { page, limit, search, category } = req.query;
    
    // Only cache the default "Home Page" request
    const isDefaultRequest = (!page || page == 1) && (limit == 20) && !search && !category;

    if (isDefaultRequest && productCache.data && (Date.now() - productCache.timestamp < 60000)) {
      // Hit immediately from memory if < 60s old
      return res.json(productCache.data);
    }

    const productsData = await productService.getAllProducts(
      page || 1,
      limit || 10,
      search || '',
      category || ''
    );

    if (isDefaultRequest) {
      productCache = { data: productsData, timestamp: Date.now() };
    }

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
