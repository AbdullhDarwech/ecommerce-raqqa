const mongoose = require('mongoose');
const connectDB = require('./config/database');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Review = require('./models/Review');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const Store = require('./models/Store');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    await connectDB();
    console.log('🔗 تم الاتصال بقاعدة البيانات بنجاح');

    // 1. مسح كافة البيانات القديمة لتجنب التكرار أو تضارب المعرفات
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Review.deleteMany(),
      Cart.deleteMany(),
      Order.deleteMany(),
      OrderItem.deleteMany(),
      Store.deleteMany()
    ]);
    console.log('🗑 تم تنظيف قاعدة البيانات بالكامل');

    // 2. إنشاء المستخدمين (الأدمن والمستخدمين العاديين)
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      { name: 'مدير النظام', email: 'admin@syrazo.com', password: hashedPassword, role: 'admin', phone: '0930000001' },
      { name: 'أحمد التاجر', email: 'ahmed@store.com', password: hashedPassword, role: 'user', phone: '0930000002' },
      { name: 'سارة خالد', email: 'sara@test.com', password: hashedPassword, role: 'user', phone: '0930000003' },
      { name: 'محمد علي', email: 'mohammed@test.com', password: hashedPassword, role: 'user', phone: '0930000004' },
      { name: 'زائر تجريبي', email: 'visitor@test.com', password: hashedPassword, role: 'user', phone: '0930000005' },
    ]);
    console.log('✅ تم إنشاء المستخدمين');

    // 3. إنشاء الفئات (Categories)
    const categories = await Category.insertMany([
      { 
        name: 'إلكترونيات', 
        description: 'أحدث الأجهزة الذكية والتقنيات العالمية', 
        imageUrl: '/images/electronics.png', 
        subcategories: ['مكيفات', 'تلفزيونات', 'هواتف ذكية', 'لابتوبات'] 
      },
      { 
        name: 'أزياء وملابس', 
        description: 'تشكيلة واسعة من الملابس الرجالية والنسائية', 
        imageUrl: '/images/fashion.png', 
        subcategories: ['رجالية', 'نسائية', 'أطفال', 'أحذية'] 
      },
    ]);
    console.log('✅ تم إنشاء الفئات');

    // 4. إنشاء المتاجر (Stores)
    const stores = await Store.insertMany([
      {
        name: 'عالم التكنولوجيا بالرقة',
        owner: users[1]._id,
        description: ['أفضل الأجهزة بضمان حقيقي', 'صيانة فورية ومجانية'],
        logo: '/images/tech-logo.png',
        coverImage: '/images/tech-cover.jpg',
        categories: [categories[0]._id],
        address: 'الرقة - شارع المجمع',
        phone: '0930111222',
        email: 'tech.world@syrazo.com',
        isActive: true
      },
      {
        name: 'بوتيك الأناقة',
        owner: users[2]._id,
        description: ['أحدث الموديلات التركية والعالمية', 'خامات ممتازة وأسعار منافسة'],
        logo: '/images/fashion-logo.png',
        coverImage: '/images/fashion-cover.jpg',
        categories: [categories[1]._id],
        address: 'الرقة - شارع تل أبيض',
        phone: '0930333444',
        email: 'elegance@syrazo.com',
        isActive: true
      }
    ]);
    console.log('✅ تم إنشاء المتاجر');

    // 5. إنشاء المنتجات وتوزيعها على المتاجر
    const productsData = [];
    const images = ['https://picsum.photos/400/500', 'https://picsum.photos/401/501', 'https://picsum.photos/402/502'];

    for (let i = 1; i <= 30; i++) {
      const isElectronics = i <= 15;
      const category = isElectronics ? categories[0] : categories[1];
      const store = isElectronics ? stores[0] : stores[1];
      const sub = category.subcategories[Math.floor(Math.random() * category.subcategories.length)];

      productsData.push({
        name: `${sub} - موديل ${i}`,
        description: [`وصف احترافي للمنتج رقم ${i}`, `جودة عالية وسعر ممتاز`, `متوفر حالياً بخصم خاص`],
        category: category._id,
        subcategory: sub,
        store: store._id,
        brand: isElectronics ? 'Apple' : 'Zara',
        pricePurchase: Math.floor(Math.random() * 400) + 50,
        priceRental: Math.floor(Math.random() * 50) + 10,
        images: [images[i % 3]],
        stockQuantity: Math.floor(Math.random() * 50) + 5,
        isBestSeller: Math.random() > 0.7
      });
    }

    const createdProducts = await Product.insertMany(productsData);
    console.log('✅ تم إنشاء المنتجات وربطها بالمتاجر');

    // 6. إنشاء طلبات تجريبية (Orders)
    // ملاحظة: قمت بتعديل هذا الجزء لإنشاء OrderItem لكل منتج داخل الطلب ليتوافق مع الـ Controller
    const ordersToCreate = 20; // إنشاء 20 طلب تجريبي
    const orderStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];

    for (let i = 0; i < ordersToCreate; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const numItems = Math.floor(Math.random() * 3) + 1;
      
      // إنشاء الطلب أولاً للحصول على الـ ID
      const order = new Order({
        user: user._id,
        deliveryAddress: { city: 'الرقة', street: 'حي النهضة', details: 'بناء رقم ' + i },
        phone: user.phone || '0930000000',
        status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
        totalPrice: 0,
        items: []
      });

      let totalOrderPrice = 0;
      const itemIds = [];

      for (let j = 0; j < numItems; j++) {
        const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const qty = Math.floor(Math.random() * 2) + 1;
        const price = product.pricePurchase;

        const orderItem = await OrderItem.create({
          order: order._id,
          product: product._id,
          quantity: qty,
          priceAtTime: price,
          orderType: 'purchase'
        });

        itemIds.push(orderItem._id);
        totalOrderPrice += price * qty;
      }

      order.items = itemIds;
      order.totalPrice = totalOrderPrice;
      await order.save();
    }
    console.log('✅ تم إنشاء الطلبات التجريبية بنجاح');

    // 7. إنشاء سلة تسوق تجريبية
    await Cart.create({
      user: users[3]._id,
      items: [
        { product: createdProducts[0]._id, quantity: 1, orderType: 'purchase' },
        { product: createdProducts[5]._id, quantity: 2, orderType: 'purchase' }
      ]
    });
    console.log('✅ تم إنشاء سلة تسوق تجريبية للمستخدم');

    console.log('🎉 تمت عملية تعبئة البيانات بنجاح تام!');
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ أثناء تعبئة البيانات:', error);
    process.exit(1);
  }
};

seedData();