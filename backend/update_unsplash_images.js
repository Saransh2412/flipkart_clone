const { sequelize, Product, ProductImage, Category } = require('./src/models');

const categoryUnsplashMap = {
  'Electronics': [
    '1496181133206-80ce9b88a853', // laptop
    '1505740420928-5e560c06d30e', // headphones
    '1523206489230-c6224ba4581e', // watch/phone
    '1546868871852-5ea0d0fb1ce3', // monitor
    '1583394838336-acd977736f90'  // watch
  ],
  'Fashion': [
    '1515886657613-9f3515b0c78f', // fashion
    '1529374255404-311a2a4f1fd9', // fashion
    '1483985988355-763728e1935b', // fashion
    '1512436991641-6745cdb1723f', // clothes
    '1434389670869-c6e4b47e5b2e'  // fashion
  ],
  'Appliances': [
    '1584286595398-a59f21d313f5', // appliance
    '1556911220-e15b29be8c8f',    // kitchen
    '1581092918056-0c4c3cb3754c', // cooking
    '1496417263034-38ec4f0b665a', // home appliance
    '1570533005686-07e5c54c3f59'  // appliance
  ],
  'Home & Furniture': [
    '1555041469-a586c61ea9bc', // home
    '1586023492125-27b2c045efd7', // furniture
    '1524758631624-e2822e304c36', // interior
    '1538688525198-9b88f6f53126', // home
    '1505693314120-0d45237b6def'  // living room
  ],
  'Books': [
    '1544947950-fa07a98d237f', // book
    '1512820790803-83ca734da794', // books
    '1495446815901-a72fe102861c', // books
    '1589829085413-56de8ae18c73', // reading
    '1532012197267-da84d127e765'  // library
  ],
  'Toys & Games': [
    '1566576912321-d58affc4b967', // toy
    '1587691592007-84dc07b7150c', // toys
    '1558066116-419b0ce946da',    // game
    '1515488042178-9e1208a5c4be', // blocks
    '1535365516-64673891461f'     // game controller
  ],
  'Sports & Outdoors': [
    '1517649763962-0c623066013b', // sports
    '1518611012118-696072aa579a', // run
    '1538805060515-38b4ffefed2e', // tennis
    '1444419988131-046ed4e408e4', // outdoor
    '1540348705912-706d34baccaf'  // weights
  ],
  'Beauty & Personal Care': [
    '1556228578-0d85b1a4d571', // makeup
    '1596462502278-27bfdc403348', // skincare
    '1522337660859-02fbefca4702', // beauty
    '1616886983084-24f6e1471b3e', // cosmetics
    '1571781256353-128489a24d08'  // skincare
  ],
  'Automotive': [
    '1494976388531-d1058494cdd8', // car
    '1502877338535-713e5052723c', // auto
    '1553440569-eaa633e02bb6',    // interior car
    '1503370604169-d4cbae35a34e', // steering wheel 
    '1580273916550-e323be2ae537'  // sport car
  ],
  'Groceries': [
    '1542838132-92c533004ce6', // grocery
    '1506617420156-8e4536971650', // food
    '1583258292694-518ada49db71', // market
    '1550989460-0adf9ea622e2',    // vegetables
    '1493770348161-369560ae357d'  // grocery bags
  ],
  'default': [
    '1505740420928-5e560c06d30e', // default
    '1611186871340-1987efaf0fa0'
  ]
};

async function updateUnsplashImages() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB...');

    const products = await Product.findAll({
      include: [{ model: Category, as: 'category' }]
    });

    for (let i = 0; i < products.length; i++) {
      const prod = products[i];
      const catName = prod.category ? prod.category.name : 'default';
      
      const ids = categoryUnsplashMap[catName] || categoryUnsplashMap['default'];
      // Deterministically pick an image so they aren't completely random every time
      const unsplashId = ids[i % ids.length];
      const newImageUrl = `https://images.unsplash.com/photo-${unsplashId}?auto=format&fit=crop&w=400&q=80`;

      // Update the ProductImage
      const imageRecord = await ProductImage.findOne({ where: { product_id: prod.id } });
      if (imageRecord) {
        await imageRecord.update({ image_url: newImageUrl });
      } else {
        await ProductImage.create({
          product_id: prod.id,
          image_url: newImageUrl
        });
      }
    }

    console.log(`Successfully updated ${products.length} product images with Unsplash URLs.`);
    process.exit(0);
  } catch (err) {
    console.error('Update failed:', err);
    process.exit(1);
  }
}

updateUnsplashImages();
