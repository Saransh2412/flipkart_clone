const { sequelize } = require('d:/Flipkart/backend/src/config/db');
const ProductImage = require('d:/Flipkart/backend/src/models/ProductImage');

async function check() {
  try {
    const images = await ProductImage.findAll({ limit: 5 });
    for (const img of images) {
      console.log(`ID: ${img.product_id}, URL length: ${img.image_url.length}, Starts with: ${img.image_url.substring(0, 50)}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

check();
