const { sequelize, Category, Product, ProductImage } = require('./src/models');

const categoriesToCreate = [
  'Electronics', 'Fashion', 'Appliances', 'Home & Furniture', 'Books',
  'Toys & Games', 'Sports & Outdoors', 'Beauty & Personal Care', 'Automotive', 'Groceries'
];

const newProducts = [
  { cat: 'Electronics', name: 'Bluetooth Speaker', desc: 'Portable high-quality bluetooth speaker', price: 49.99, stock: 120, img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop' },
  { cat: 'Electronics', name: 'Tablet Pro', desc: '10-inch tablet with stylus support', price: 349.99, stock: 45, img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop' },
  { cat: 'Electronics', name: 'Gaming Mouse', desc: 'Ergonomic gaming mouse with RGB', price: 29.99, stock: 200, img: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop' },
  { cat: 'Electronics', name: 'Mechanical Keyboard', desc: 'Mechanical keyboard with blue switches', price: 79.99, stock: 60, img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop' },
  { cat: 'Electronics', name: 'Monitor 27-inch', desc: '144Hz IPS Gaming Monitor', price: 249.99, stock: 35, img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop' },
  { cat: 'Electronics', name: 'External SSD 1TB', desc: 'Fast USB-C solid state drive', price: 109.99, stock: 80, img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop' },

  { cat: 'Fashion', name: 'Denim Jacket', desc: 'Classic blue denim jacket for men', price: 59.99, stock: 50, img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop' },
  { cat: 'Fashion', name: 'Running Shorts', desc: 'Breathable athletic running shorts', price: 19.99, stock: 150, img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop' },
  { cat: 'Fashion', name: 'Leather Wallet', desc: 'Genuine leather bifold wallet', price: 24.99, stock: 100, img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop' },
  { cat: 'Fashion', name: 'Sunglasses', desc: 'Polarized aviator sunglasses', price: 14.99, stock: 200, img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop' },
  { cat: 'Fashion', name: 'Winter Beanie', desc: 'Warm knitted winter hat', price: 9.99, stock: 180, img: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&h=400&fit=crop' },
  { cat: 'Fashion', name: 'Canvas Shoes', desc: 'Casual canvas slip-on shoes', price: 29.99, stock: 90, img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop' },

  { cat: 'Appliances', name: 'Blender', desc: 'High-speed blender for smoothies', price: 39.99, stock: 40, img: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop' },
  { cat: 'Appliances', name: 'Toaster', desc: '2-slice stainless steel toaster', price: 24.99, stock: 60, img: 'https://images.unsplash.com/photo-1585237672814-8f85a8118bf6?w=400&h=400&fit=crop' },
  { cat: 'Appliances', name: 'Coffee Maker', desc: 'Programmable drip coffee maker', price: 49.99, stock: 30, img: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop' },
  { cat: 'Appliances', name: 'Electric Kettle', desc: '1.7L electric kettle with auto-shutoff', price: 29.99, stock: 85, img: 'https://images.unsplash.com/photo-1594213114663-d94db9b17440?w=400&h=400&fit=crop' },
  { cat: 'Appliances', name: 'Iron', desc: 'Steam iron with non-stick soleplate', price: 19.99, stock: 70, img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop' },
  { cat: 'Appliances', name: 'Air Purifier', desc: 'HEPA air purifier for home', price: 129.99, stock: 25, img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop' },

  { cat: 'Home & Furniture', name: 'Floor Lamp', desc: 'Modern standing floor lamp', price: 45.99, stock: 30, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop' },
  { cat: 'Home & Furniture', name: 'Throw Blanket', desc: 'Soft fleece throw blanket', price: 19.99, stock: 120, img: 'https://images.unsplash.com/photo-1580301762395-21ce6d5d4bc4?w=400&h=400&fit=crop' },
  { cat: 'Home & Furniture', name: 'Wall Clock', desc: 'Silent non-ticking wall clock', price: 14.99, stock: 150, img: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=400&fit=crop' },
  { cat: 'Home & Furniture', name: 'Coffee Table', desc: 'Wooden center coffee table', price: 89.99, stock: 15, img: 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=400&h=400&fit=crop' },
  { cat: 'Home & Furniture', name: 'Bookshelf', desc: '5-tier wooden bookshelf', price: 69.99, stock: 20, img: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=400&fit=crop' },
  { cat: 'Home & Furniture', name: 'Curtains', desc: 'Blackout room darkening curtains', price: 29.99, stock: 55, img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop' },

  { cat: 'Books', name: 'The Hobbit', desc: 'Fantasy novel by J.R.R. Tolkien', price: 14.99, stock: 100, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop' },
  { cat: 'Books', name: 'Dune', desc: 'Sci-fi classic by Frank Herbert', price: 11.99, stock: 120, img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop' },
  { cat: 'Books', name: 'Thinking, Fast and Slow', desc: 'Psychology book by Daniel Kahneman', price: 16.99, stock: 80, img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=400&fit=crop' },
  { cat: 'Books', name: 'Clean Code', desc: 'Software engineering textbook', price: 35.99, stock: 40, img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop' },
  { cat: 'Books', name: 'Project Hail Mary', desc: 'Sci-fi novel by Andy Weir', price: 19.99, stock: 90, img: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop' },
  { cat: 'Books', name: 'Steve Jobs', desc: 'Biography by Walter Isaacson', price: 18.99, stock: 60, img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=400&fit=crop' },

  { cat: 'Toys & Games', name: 'Lego Classic Set', desc: 'Creative building block set', price: 29.99, stock: 75, img: 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=400&fit=crop' },
  { cat: 'Toys & Games', name: 'Board Game - Monopoly', desc: 'Classic family board game', price: 19.99, stock: 110, img: 'https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=400&h=400&fit=crop' },
  { cat: 'Toys & Games', name: 'Action Figure', desc: 'Superhero articulated action figure', price: 12.99, stock: 200, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop' },
  { cat: 'Toys & Games', name: 'Puzzle 1000 Pieces', desc: 'Landscape jigsaw puzzle', price: 14.99, stock: 85, img: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=400&h=400&fit=crop' },
  { cat: 'Toys & Games', name: 'Stuffed Bear', desc: 'Soft plush teddy bear', price: 15.99, stock: 140, img: 'https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=400&h=400&fit=crop' },

  { cat: 'Sports & Outdoors', name: 'Yoga Mat', desc: 'Non-slip exercise yoga mat', price: 24.99, stock: 90, img: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop' },
  { cat: 'Sports & Outdoors', name: 'Dumbbell Set', desc: 'Adjustable dumbbell weights', price: 59.99, stock: 30, img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop' },
  { cat: 'Sports & Outdoors', name: 'Tennis Racket', desc: 'Lightweight professional tennis racket', price: 79.99, stock: 20, img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=400&fit=crop' },
  { cat: 'Sports & Outdoors', name: 'Camping Tent', desc: '4-person outdoor camping tent', price: 89.99, stock: 15, img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=400&fit=crop' },
  { cat: 'Sports & Outdoors', name: 'Water Bottle', desc: 'Stainless steel insulated bottle', price: 19.99, stock: 250, img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop' },

  { cat: 'Beauty & Personal Care', name: 'Moisturizer', desc: 'Daily facial moisturizer with SPF', price: 15.99, stock: 100, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop' },
  { cat: 'Beauty & Personal Care', name: 'Shampoo', desc: 'Sulfate-free nourishing shampoo', price: 12.99, stock: 150, img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop' },
  { cat: 'Beauty & Personal Care', name: 'Perfume', desc: 'Eau de parfum for women', price: 49.99, stock: 40, img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop' },
  { cat: 'Beauty & Personal Care', name: 'Electric Toothbrush', desc: 'Rechargeable sonic toothbrush', price: 39.99, stock: 60, img: 'https://images.unsplash.com/photo-1559589689-577aabd1db4f?w=400&h=400&fit=crop' },
  { cat: 'Beauty & Personal Care', name: 'Hair Dryer', desc: 'Ionic hair dryer with diffuser', price: 29.99, stock: 80, img: 'https://images.unsplash.com/photo-1522338242992-e1a54f0e2571?w=400&h=400&fit=crop' },

  { cat: 'Automotive', name: 'Car Vacuum', desc: 'Portable handheld car vacuum cleaner', price: 34.99, stock: 50, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop' },
  { cat: 'Automotive', name: 'Dash Cam', desc: '1080p front and rear dash camera', price: 59.99, stock: 40, img: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400&h=400&fit=crop' },
  { cat: 'Automotive', name: 'Tire Inflator', desc: 'Portable air compressor for tires', price: 29.99, stock: 75, img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop' },
  { cat: 'Automotive', name: 'Wiper Blades', desc: 'All-season windshield wiper blades', price: 18.99, stock: 120, img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop' },
  { cat: 'Automotive', name: 'Microfiber Towels', desc: 'Pack of 12 car cleaning towels', price: 14.99, stock: 300, img: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=400&fit=crop' }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB...');

    // Synchronize models if needed (ensure tables exist)
    await sequelize.sync();

    // Ensure all categories exist
    const categoryMap = {};
    for (const catName of categoriesToCreate) {
      const [category] = await Category.findOrCreate({ where: { name: catName } });
      categoryMap[catName] = category.id;
    }

    console.log('Categories set up. Updating product images...');

    // First, update existing products that have placeholder images
    const existingProducts = await Product.findAll({
      include: [{ model: ProductImage, as: 'images' }]
    });

    // Build a name-to-img map from our newProducts array
    const nameToImg = {};
    for (const p of newProducts) {
      nameToImg[p.name] = p.img;
    }

    // Category-level fallback Unsplash images
    const categoryImages = {
      'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop',
      'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
      'Appliances': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      'Home & Furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      'Books': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
      'Toys & Games': 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=400&fit=crop',
      'Sports & Outdoors': 'https://images.unsplash.com/photo-1461896836934-bd45533e6e4a?w=400&h=400&fit=crop',
      'Beauty & Personal Care': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
      'Automotive': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop',
      'Groceries': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop'
    };

    // Specific images for the original seed.sql products
    const originalProductImages = {
      'Smartphone X': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      'Laptop Pro': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      'Wireless Earbuds': 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop',
      'Smartwatch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      'Gaming Console': 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400&h=400&fit=crop',
      '4K TV': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
      "Men's T-Shirt": 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      "Women's Jeans": 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop',
      'Sneakers': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      'Winter Jacket': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
      'Formal Shirt': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
      'Summer Dress': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop',
      'Refrigerator': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop',
      'Washing Machine': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop',
      'Microwave Oven': 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=400&fit=crop',
      'Air Conditioner': 'https://images.unsplash.com/photo-1631567091046-7aaae4ec1b46?w=400&h=400&fit=crop',
      'Vacuum Cleaner': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop',
      'Sofa Set': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      'Dining Table': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=400&fit=crop',
      'Office Chair': 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=400&fit=crop',
      'Bed Frame': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop',
      'The Great Gatsby': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
      '1984': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=400&fit=crop',
      'Sapiens': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=400&fit=crop',
      'Atomic Habits': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop'
    };

    // Merge all image maps
    const allImgMaps = { ...nameToImg, ...originalProductImages };

    let updatedCount = 0;
    for (const product of existingProducts) {
      const imgs = product.images || [];
      // Check if images are missing or use placeholder URLs
      const needsUpdate = imgs.length === 0 || imgs.some(img => 
        img.image_url.includes('placeholder') || img.image_url.includes('placehold')
      );

      if (needsUpdate) {
        // Delete old placeholder images
        await ProductImage.destroy({ where: { product_id: product.id } });

        // Get a proper image URL
        let newImgUrl = allImgMaps[product.name];
        if (!newImgUrl) {
          // Use category-based fallback
          const cat = await Category.findByPk(product.category_id);
          newImgUrl = cat ? (categoryImages[cat.name] || categoryImages['Electronics']) : categoryImages['Electronics'];
        }

        await ProductImage.create({
          product_id: product.id,
          image_url: newImgUrl
        });
        updatedCount++;
      }
    }

    console.log(`Updated ${updatedCount} existing products with real images.`);

    // Now insert any new products that don't exist
    let insertedCount = 0;
    for (const prodData of newProducts) {
      const existing = await Product.findOne({ where: { name: prodData.name } });
      if (!existing) {
        const product = await Product.create({
          category_id: categoryMap[prodData.cat],
          name: prodData.name,
          description: prodData.desc,
          price: prodData.price,
          stock: prodData.stock
        });

        await ProductImage.create({
          product_id: product.id,
          image_url: prodData.img
        });
        insertedCount++;
      }
    }

    console.log(`Inserted ${insertedCount} new products.`);
    console.log('Seeding complete!');
    process.exit(0);

  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
