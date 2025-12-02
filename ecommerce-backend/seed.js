const mongoose = require('mongoose');
const connectDB = require('./config/database'); // تأكد من أن المسار صحيح
const { User, Category, Product, Review, Cart, Order } = require('./models');
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
    console.log('🗑 تم مسح البيانات القديمة');

    // ----------------------------
    // إنشاء المستخدمين (مدير + مستخدمين)
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
    // إنشاء الفئات مع الأقسام الفرعية
    // ----------------------------
    const categories = await Category.insertMany([
      {
        name: 'إلكترونيات',
        description: 'أجهزة إلكترونية وأدوات',
        localInventoryNotes: 'متوفرة في مراكز التقنية بالرقّة',
        subcategories: ['مكيفات', 'تلفزيونات', 'ثلاجات', 'غسالات', 'هواتف', 'حواسيب', 'سماعات', 'كاميرات'],
      },
      {
        name: 'ملابس',
        description: 'ملابس وأزياء',
        localInventoryNotes: 'مصنوعة محليًا',
        subcategories: ['رجالية', 'نسائية', 'أطفال', 'رياضية', 'شتوية', 'صيفية', 'أحذية', 'إكسسوارات'],
      },
      {
        name: 'أثاث',
        description: 'أثاث المنزل والمكتب',
        localInventoryNotes: 'متين للجو الصحراوي',
        subcategories: ['غرف نوم', 'غرف معيشة', 'مكاتب', 'مطابخ', 'أثاث خارجي', 'خزائن', 'طاولات', 'كراسي'],
      },
      {
        name: 'مستلزمات منزلية',
        description: 'أدوات منزلية أساسية',
        localInventoryNotes: 'متوفرة محليًا',
        subcategories: ['أدوات مطبخ', 'منظفات', 'أدوات حديقة', 'إضاءة', 'أدوات صحية', 'أغطية', 'مفروشات', 'أدوات تنظيف'],
      },
      {
        name: 'ألعاب',
        description: 'ألعاب وألعاب تعليمية للأطفال',
        localInventoryNotes: 'متعة للعائلات',
        subcategories: ['ألعاب تعليمية', 'ألعاب خارجية', 'دمى', 'ألعاب فيديو', 'ألعاب بناء', 'ألعاب رياضية', 'ألعاب موسيقية', 'ألعاب مائية'],
      },
      {
        name: 'مستحضرات تجميل',
        description: 'منتجات التجميل والعناية',
        localInventoryNotes: 'خيارات حلال متوفرة',
        subcategories: ['عناية بالبشرة', 'عناية بالشعر', 'مكياج', 'عطور', 'عناية بالأظافر', 'منتجات رجالية', 'منتجات طبيعية', 'أدوات تجميل'],
      },
      {
        name: 'أغذية',
        description: 'مواد غذائية ووجبات خفيفة',
        localInventoryNotes: 'منتجات محلية طازجة',
        subcategories: ['فواكه وخضار', 'لحوم', 'ألبان', 'مخبوزات', 'مشروبات', 'حلويات', 'توابل', 'معلبات'],
      },
      {
        name: 'كتب',
        description: 'كتب وأدب',
        localInventoryNotes: 'مصادر تعليمية',
        subcategories: ['روايات', 'تعليمية', 'أطفال', 'دينية', 'تاريخية', 'علمية', 'فنون', 'لغات'],
      },
    ]);
    console.log('✅ تم إنشاء الفئات');

    // ----------------------------
    // إنشاء المنتجات
    // ----------------------------
    const products = [];
    const brands = ['ماركةX', 'ماركةY', 'ماركةZ', 'محلية', 'عالمية'];
    const images = [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
      'https://example.com/image3.jpg'
    ];

    categories.forEach(category => {
      category.subcategories.forEach(sub => {
        for (let i = 1; i <= 200; i++) { // 200 منتج لكل قسم فرعي
          products.push({
            name: `${sub} منتج ${i}`,
            description: `وصف المنتج ${i} للقسم ${sub}`,
            category: category._id,
            subcategory: sub,
            brand: brands[Math.floor(Math.random() * brands.length)],
            pricePurchase: Math.floor(Math.random() * 500) + 10,
            priceRental: Math.floor(Math.random() * 100) + 5,
            images: images.slice(0, Math.floor(Math.random() * 3) + 1),
            stockQuantity: Math.floor(Math.random() * 100) + 1,
            isBestSeller: Math.random() > 0.8,
            discountPercentage: Math.random() > 0.7 ? Math.floor(Math.random() * 50) : 0,
          });
        }
      });
    });

    await Product.insertMany(products);
    console.log('✅ تم إنشاء آلاف المنتجات');

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
        const productIndex = Math.floor(Math.random() * products.length);
        const product = products[productIndex];
        items.push({
          product: product._id,
          quantity: Math.floor(Math.random() * 5) + 1,
          orderType: Math.random() > 0.5 ? 'purchase' : 'rental',
        });
      }

      orders.push({
        user: user._id,
        items,
        totalAmount: items.reduce((sum, item) => {
          const prod = products.find(p => p._id.toString() === item.product.toString());
          return prod ? sum + (item.quantity * (item.orderType === 'purchase' ? prod.pricePurchase : prod.priceRental)) : sum;
        }, 0),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        shippingAddress: `العنوان ${i}, الرقة, سوريا`,
      });
    }

    await Order.insertMany(orders);
    console.log('✅ تم إنشاء 500 طلب مع عناصر كثيرة');

    // ----------------------------
    // إنشاء سلات (Carts)
    // ----------------------------
    const carts = [];
    users.forEach(user => {
      if (Math.random() > 0.5) {
        const numItems = Math.floor(Math.random() * 5) + 1;
        const items = [];
        for (let j = 0; j < numItems; j++) {
          const product = products[Math.floor(Math.random() * products.length)];
          items.push({
            product: product._id,
            quantity: Math.floor(Math.random() * 3) + 1,
            orderType: Math.random() > 0.5 ? 'purchase' : 'rental',
          });
        }
        carts.push({ user: user._id, items });
      }
    });

    await Cart.insertMany(carts);
    console.log('✅ تم إنشاء السلات');

    console.log('🎉 تم تعبئة قاعدة البيانات بنجاح مع كمية ضخمة من البيانات!');
    process.exit();
  } catch (error) {
    console.error('خطأ أثناء تعبئة البيانات:', error);
    process.exit(1);
  }
};

seedData();
