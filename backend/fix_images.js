// Fix all product images with keyword-matched images from loremflickr
// loremflickr serves real photos that match the keyword search term
const { sequelize, Product, ProductImage } = require('./src/models');

// Map every product to a specific search keyword for accurate image matching
const productKeywords = {
  // Electronics
  'Smartphone X': 'smartphone',
  'Laptop Pro': 'laptop',
  'Wireless Earbuds': 'earbuds',
  'Smartwatch': 'smartwatch',
  'Gaming Console': 'playstation,console',
  '4K TV': 'television,flatscreen',
  'Bluetooth Speaker': 'bluetooth,speaker',
  'Tablet Pro': 'tablet,ipad',
  'Gaming Mouse': 'gaming,mouse',
  'Mechanical Keyboard': 'mechanical,keyboard',
  'Monitor 27-inch': 'computer,monitor',
  'External SSD 1TB': 'hard,drive,ssd',

  // Fashion
  "Men's T-Shirt": 'tshirt,mens',
  "Women's Jeans": 'jeans,womens',
  'Sneakers': 'sneakers,shoes',
  'Winter Jacket': 'winter,jacket',
  'Formal Shirt': 'formal,shirt',
  'Summer Dress': 'summer,dress',
  'Denim Jacket': 'denim,jacket',
  'Running Shorts': 'running,shorts',
  'Leather Wallet': 'leather,wallet',
  'Sunglasses': 'sunglasses',
  'Winter Beanie': 'beanie,hat',
  'Canvas Shoes': 'canvas,shoes',

  // Appliances
  'Refrigerator': 'refrigerator',
  'Washing Machine': 'washing,machine',
  'Microwave Oven': 'microwave,oven',
  'Air Conditioner': 'air,conditioner',
  'Vacuum Cleaner': 'vacuum,cleaner',
  'Blender': 'blender,kitchen',
  'Toaster': 'toaster',
  'Coffee Maker': 'coffee,maker',
  'Electric Kettle': 'electric,kettle',
  'Iron': 'steam,iron',
  'Air Purifier': 'air,purifier',

  // Home & Furniture
  'Sofa Set': 'sofa,couch',
  'Dining Table': 'dining,table',
  'Office Chair': 'office,chair',
  'Bed Frame': 'bed,bedroom',
  'Floor Lamp': 'floor,lamp',
  'Throw Blanket': 'blanket,throw',
  'Wall Clock': 'wall,clock',
  'Coffee Table': 'coffee,table',
  'Bookshelf': 'bookshelf',
  'Curtains': 'curtains,window',

  // Books
  'The Great Gatsby': 'book,novel',
  '1984': 'book,reading',
  'Sapiens': 'book,history',
  'Atomic Habits': 'book,selfhelp',
  'The Hobbit': 'book,fantasy',
  'Dune': 'book,scifi',
  'Thinking, Fast and Slow': 'book,psychology',
  'Clean Code': 'programming,book',
  'Project Hail Mary': 'book,space',
  'Steve Jobs': 'book,biography',

  // Toys & Games
  'Lego Classic Set': 'lego,blocks',
  'Board Game - Monopoly': 'board,game',
  'Action Figure': 'action,figure,toy',
  'Puzzle 1000 Pieces': 'jigsaw,puzzle',
  'Stuffed Bear': 'teddy,bear',

  // Sports & Outdoors
  'Yoga Mat': 'yoga,mat',
  'Dumbbell Set': 'dumbbell,weights',
  'Tennis Racket': 'tennis,racket',
  'Camping Tent': 'camping,tent',
  'Water Bottle': 'water,bottle',

  // Beauty & Personal Care
  'Moisturizer': 'moisturizer,skincare',
  'Shampoo': 'shampoo,haircare',
  'Perfume': 'perfume,fragrance',
  'Electric Toothbrush': 'toothbrush,electric',
  'Hair Dryer': 'hairdryer',

  // Automotive
  'Car Vacuum': 'car,vacuum',
  'Dash Cam': 'dashcam,car',
  'Tire Inflator': 'tire,inflator',
  'Wiper Blades': 'car,windshield',
  'Microfiber Towels': 'microfiber,cleaning',
};

async function fixAllImages() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB.');

    const products = await Product.findAll({ order: [['id', 'ASC']] });
    console.log(`Found ${products.length} products. Updating with keyword-matched images...\n`);

    let updated = 0;
    for (const product of products) {
      // Delete existing images
      await ProductImage.destroy({ where: { product_id: product.id } });

      // Get keyword for this product
      const keyword = productKeywords[product.name] || product.name.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ',');

      // Use loremflickr which returns images matching the keyword
      // Adding lock=productId to get a consistent (deterministic) image per product
      const imageUrl = `https://loremflickr.com/400/400/${keyword}?lock=${product.id}`;

      await ProductImage.create({
        product_id: product.id,
        image_url: imageUrl
      });

      updated++;
      console.log(`  [${product.id}] ${product.name} -> ${keyword}`);
    }

    console.log(`\nDone! Updated ${updated} products with keyword-matched images.`);
    process.exit(0);
  } catch (err) {
    console.error('Failed:', err);
    process.exit(1);
  }
}

fixAllImages();
