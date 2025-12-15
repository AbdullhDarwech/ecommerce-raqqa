const mongoose = require('mongoose');
const connectDB = require('./config/database'); // تأكد من المسار
const { User, Category, Product, Review, Cart, Order, Store } = require('./models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    await connectDB();
    console.log('🔗 تم الاتصال بقاعدة البيانات');

    // ----------------------------
    // مسح البيانات القديمة
    // ----------------------------
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    await Store.deleteMany();
    console.log('🗑 تم مسح البيانات القديمة');

    // ----------------------------
    // إنشاء المستخدمين
    // ----------------------------
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      { email: 'admin@example.com', password: hashedPassword, name: 'المسؤول', role: 'admin' },
      { email: 'user1@example.com', password: hashedPassword, name: 'مستخدم 1', role: 'user' },
      { email: 'user2@example.com', password: hashedPassword, name: 'مستخدم 2', role: 'user' },
      { email: 'user3@example.com', password: hashedPassword, name: 'مستخدم 3', role: 'user' },
      { email: 'user4@example.com', password: hashedPassword, name: 'مستخدم 4', role: 'user' },
    ]);
    console.log('✅ تم إنشاء المستخدمين');

    // ----------------------------
    // إنشاء الفئات
    // ----------------------------
    const categories = await Category.insertMany([
      { name: 'إلكترونيات', description: 'أجهزة إلكترونية وأدوات', imageUrl: '/images/tecnloje.png', subcategories: ['مكيفات', 'تلفزيونات', 'هواتف'] },
      { name: 'ملابس', description: 'ملابس وأزياء', imageUrl: '/images/cloths.png', subcategories: ['رجالية', 'نسائية'] },
    ]);
    console.log('✅ تم إنشاء الفئات');

    // ----------------------------
    // إنشاء المنتجات
    // ----------------------------
    const products = [];
    const brands = ['ماركةX', 'ماركةY', 'محلية'];
    const images = [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
      'https://example.com/image3.jpg'
    ];

    categories.forEach(category => {
      category.subcategories.forEach(sub => {
        for (let i = 1; i <= 10; i++) { // 10 منتجات لكل قسم فرعي (لتجربة سريعة)
          products.push({
            name: `${sub} منتج ${i}`,
            description: [
              `وصف المنتج ${i} للقسم ${sub} — السطر الأول`,
              `تفاصيل إضافية عن المنتج ${i} — السطر الثاني`,
            ],
            category: category._id,
            subcategory: sub,
            brand: brands[Math.floor(Math.random() * brands.length)],
            pricePurchase: Math.floor(Math.random() * 500) + 10,
            priceRental: Math.floor(Math.random() * 100) + 5,
            images: images.slice(0, Math.floor(Math.random() * 3) + 1),
            stockQuantity: Math.floor(Math.random() * 100) + 1,
          });
        }
      });
    });

    const createdProducts = await Product.insertMany(products);
    console.log('✅ تم إنشاء المنتجات');

    const storesData = [
      {
        name: 'متجر الإلكترونيات',
        owner: users[1]._id,
        description: [
          'متجر متخصص في الإلكترونيات',
          'أفضل الأسعار وأحدث الأجهزة'
        ],
        logo: '/images/store1-logo.png',
        coverImage: '/images/store1-cover.png',
        categories: [categories[0]._id], // إلكترونيات
        address: 'الرقة',
        phone: '0999999999',
        email: 'electro@store.com'
      },
      {
        name: 'متجر الملابس',
        owner: users[2]._id,
        description: [
          'ملابس عصرية لجميع الأعمار',
          'جودة ممتازة'
        ],
        logo: '/images/store2-logo.png',
        coverImage: '/images/store2-cover.png',
        categories: [categories[1]._id], // ملابس
        address: 'حلب',
        phone: '0988888888',
        email: 'clothes@store.com'
      }
    ];
    
    // ربط المنتجات بكل متجر
    const stores = storesData.map(store => {
      const relatedProducts = createdProducts
        .filter(p => store.categories.includes(p.category))
        .slice(0, 10)
        .map(p => p._id);
    
      return { ...store, products: relatedProducts };
    });
    
    await Store.insertMany(stores);
    console.log('✅ تم إنشاء المتاجر');

    await Store.insertMany(stores);
    console.log('✅ تم إنشاء المتاجر');

    // ----------------------------
    // إنشاء الطلبات (Orders)
    // ----------------------------
    const orders = [];
    const statuses = ['pending', 'shipped', 'delivered'];
    
    for (let i = 1; i <= 500; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const numItems = Math.floor(Math.random() * 10) + 1;
      const items = [];
    
      for (let j = 0; j < numItems; j++) {
        const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        items.push({
          product: product._id, // ObjectId صحيح
          quantity: Math.floor(Math.random() * 5) + 1,
          orderType: Math.random() > 0.5 ? 'purchase' : 'rental',
        });
      }
    
      orders.push({
        user: user._id,
        items,
        totalAmount: items.reduce((sum, item) => {
          const prod = createdProducts.find(p => p._id.equals(item.product));
          return prod ? sum + (item.quantity * (item.orderType === 'purchase' ? prod.pricePurchase : prod.priceRental)) : sum;
        }, 0),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        shippingAddress: `العنوان ${i}, الرقة, سوريا`,
      });
    }
    
    await Order.insertMany(orders);
    
    await Order.insertMany(orders);
    console.log('✅ تم إنشاء الطلبات');

    // ----------------------------
    // إنشاء السلات (Carts)
    // ----------------------------
    const carts = [];
    users.forEach(user => {
      if (Math.random() > 0.5) {
        const numItems = Math.floor(Math.random() * 3) + 1;
        const items = [];
        for (let j = 0; j < numItems; j++) {
          const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
          items.push({
            product: product._id,
            quantity: Math.floor(Math.random() * 2) + 1,
            orderType: Math.random() > 0.5 ? 'purchase' : 'rental',
          });
        }
        carts.push({ user: user._id, items });
      }
    });

    await Cart.insertMany(carts);
    console.log('✅ تم إنشاء السلات');

    console.log('🎉 تم تعبئة قاعدة البيانات بنجاح!');
    process.exit();
  } catch (error) {
    console.error('خطأ أثناء تعبئة البيانات:', error);
    process.exit(1);
  }
};

seedData();
