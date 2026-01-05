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

/**
 * دالة تعبئة البيانات التجريبية مع صور Unsplash حقيقية وفريدة
 */
const seedData = async () => {
  try {
    await connectDB();
    console.log('🔗 تم الاتصال بقاعدة البيانات - بدء التعبئة');

    // تنظيف البيانات القديمة
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
    console.log('🗑 تم تنظيف كافة السجلات القديمة');

    // 1. إنشاء المستخدمين
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      { name: 'مدير النظام', email: 'admin@furato.com', password: hashedPassword, role: 'admin', phone: '0930000001' },
      { name: 'ياسين للتجارة', email: 'yassin@store.com', password: hashedPassword, role: 'user', phone: '0930000002' },
      { name: 'بوتيك لورين', email: 'lauren@store.com', password: hashedPassword, role: 'user', phone: '0930000003' },
      { name: 'محمد العلي', email: 'mohamed@store.com', password: hashedPassword, role: 'user', phone: '0930000004' },
      { name: 'أحمد النخبة', email: 'ahmed@store.com', password: hashedPassword, role: 'user', phone: '0930000005' },
      { name: 'عمر الفخامة', email: 'omar@store.com', password: hashedPassword, role: 'user', phone: '0930000006' },
      { name: 'خالد الذهبي', email: 'khaled@store.com', password: hashedPassword, role: 'user', phone: '0930000007' },
      { name: 'سامي الماس', email: 'sami@store.com', password: hashedPassword, role: 'user', phone: '0930000008' },
    ]);
    console.log('✅ تم إنشاء 8 مستخدمين');

    // 2. إنشاء 8 فئات رئيسية مع صور حقيقية
    const categories = await Category.insertMany([
      { 
        name: 'إلكترونيات', 
        description: 'أحدث الأجهزة الإلكترونية والتقنيات الذكية', 
        imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop', 
        subcategories: ['هواتف ذكية', 'لابتوبات', 'ساعات ذكية', 'أجهزة لوحية', 'سماعات'] 
      },
      { 
        name: 'أزياء رجالية', 
        description: 'أرقى الملابس والأحذية الرجالية', 
        imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b830c6050?w=800&auto=format&fit=crop', 
        subcategories: ['بدلات', 'قمصان', 'بناطيل', 'أحذية', 'إكسسوارات'] 
      },
      { 
        name: 'أزياء نسائية', 
        description: 'أحدث صيحات الموضة النسائية', 
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop', 
        subcategories: ['فساتين', 'تنانير', 'بلوزات', 'أحذية', 'حقائب'] 
      },
      { 
        name: 'ساعات يد', 
        description: 'ساعات فاخرة من أرقى الماركات العالمية', 
        imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop', 
        subcategories: ['سويسرية', 'رياضية', 'كلاسيكية', 'ذكية'] 
      },
      { 
        name: 'عطور', 
        description: 'أرقى العطور العالمية والنادرة', 
        imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop', 
        subcategories: ['رجالية', 'نسائية', 'عائلية', 'نادرة'] 
      },
      { 
        name: 'مجوهرات', 
        description: 'قطع مجوهرات فاخرة ومميزة', 
        imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop', 
        subcategories: ['ذهب', 'فضة', 'ألماس', 'ساعات'] 
      },
      { 
        name: 'أثاث منزلي', 
        description: 'أثاث فاخر وديكورات راقية', 
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop', 
        subcategories: ['غرف نوم', 'صالات', 'مطابخ', 'ديكورات'] 
      },
      { 
        name: 'أجهزة كهربائية', 
        description: 'أجهزة منزلية حديثة وذكية', 
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop', 
        subcategories: ['تلفزيونات', 'ثلاجات', 'غسالات', 'مكيفات'] 
      }
    ]);
    console.log('✅ تم إنشاء 8 فئات رئيسية');

    // 3. إنشاء 8 متاجر
    const stores = await Store.insertMany([
      {
        name: 'فوراتو للإلكترونيات',
        owner: users[0]._id,
        description: ['الوكيل الحصري لأجهزة أبل وسامسونج في الرقة'],
        logo: 'https://images.unsplash.com/photo-1541140134513-85a161dc4a00?w=400&auto=format&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop',
        categories: [categories[0]._id],
        address: 'الرقة - برج النخبة - الطابق الأول',
        phone: '0930111222',
        email: 'electronics@furato.com',
        isActive: true
      },
      {
        name: 'بوتيك فوراتو للأزياء',
        owner: users[1]._id,
        description: ['أرقى الماركات العالمية من إيطاليا وفرنسا'],
        logo: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&auto=format&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop',
        categories: [categories[1]._id, categories[2]._id],
        address: 'الرقة - حي الثكنة - مجمع السلام',
        phone: '0930222333',
        email: 'fashion@furato.com',
        isActive: true
      },
      {
        name: 'دار فوراتو للساعات',
        owner: users[2]._id,
        description: ['ساعات فاخرة من روليكس وأوديمار بيجيه'],
        logo: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&auto=format&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1516487200032-8532cb603261?w=1200&auto=format&fit=crop',
        categories: [categories[3]._id],
        address: 'الرقة - ساحة البريد',
        phone: '0930333444',
        email: 'watches@furato.com',
        isActive: true
      },
      {
        name: 'فوراتو للعطور النادرة',
        owner: users[3]._id,
        description: ['أندر العطور العالمية والإصدارات المحدودة'],
        logo: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&auto=format&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&auto=format&fit=crop',
        categories: [categories[4]._id],
        address: 'الرقة - شارع الخابور',
        phone: '0930444555',
        email: 'perfumes@furato.com',
        isActive: true
      },
      {
        name: 'صياغة فوراتو للمجوهرات',
        owner: users[4]._id,
        description: ['مجوهرات مصممة يدوياً من الذهب والألماس'],
        logo: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&auto=format&fit=crop',
        categories: [categories[5]._id],
        address: 'الرقة - سوق الذهب',
        phone: '0930555666',
        email: 'jewelry@furato.com',
        isActive: true
      },
      {
        name: 'فوراتو للأثاث الفاخر',
        owner: users[5]._id,
        description: ['أثاث راقي من خشب الزان والأرز الطبيعي'],
        logo: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&auto=format&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop',
        categories: [categories[6]._id],
        address: 'الرقة - منطقة الصناعة',
        phone: '0930666777',
        email: 'furniture@furato.com',
        isActive: true
      },
      {
        name: 'فوراتو للأجهزة المنزلية',
        owner: users[6]._id,
        description: ['أحدث الأجهزة الكهربائية الذكية'],
        logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop',
        categories: [categories[7]._id],
        address: 'الرقة - شارع التكامل',
        phone: '0930777888',
        email: 'appliances@furato.com',
        isActive: true
      },
      {
        name: 'فوراتو للتسوق الشامل',
        owner: users[7]._id,
        description: ['جميع المنتجات تحت سقف واحد'],
        logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&auto=format&fit=crop',
        categories: categories.map(cat => cat._id),
        address: 'الرقة - مركز المدينة',
        phone: '0930888999',
        email: 'mall@furato.com',
        isActive: true
      }
    ]);
    console.log('✅ تم إنشاء 8 متاجر');

    // 4. مجموعة صور Unsplash حقيقية لكل فئة
    const productImages = {
      // إلكترونيات
      electronics: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1546054451-aa739e1fb6ee?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop'
      ],
      
      // أزياء رجالية
      fashionMen: [
        'https://images.unsplash.com/photo-1594932224828-b4b05a83296d?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop'
      ],
      
      // أزياء نسائية
      fashionWomen: [
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558769132-cb1cb458edb0?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558769132-cb1cb458edb0?w=800&auto=format&fit=crop'
      ],
      
      // ساعات
      watches: [
        'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop'
      ],
      
      // عطور
      perfumes: [
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop'
      ],
      
      // مجوهرات
      jewelry: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop'
      ],
      
      // أثاث
      furniture: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop'
      ],
      
      // أجهزة كهربائية
      appliances: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1567721913496-cc5c8d78b73c?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1567721913496-cc5c8d78b73c?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1567721913496-cc5c8d78b73c?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop'
      ]
    };

    // 5. إنشاء 210 منتج مع صور حقيقية
    const productsData = [];
    
    // ماركات مختلفة
    const brands = {
      electronics: ['Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP', 'Huawei', 'Xiaomi'],
      fashionMen: ['Armani', 'Hugo Boss', 'Zara', 'Mango', 'Massimo Dutti', 'Ted Baker'],
      fashionWomen: ['Chanel', 'Dior', 'Gucci', 'Prada', 'Versace', 'Louis Vuitton'],
      watches: ['Rolex', 'Omega', 'Tag Heuer', 'Cartier', 'Audemars Piguet', 'Patek Philippe'],
      perfumes: ['Chanel', 'Dior', 'YSL', 'Gucci', 'Versace', 'Armani', 'Tom Ford'],
      jewelry: ['Cartier', 'Tiffany', 'Bvlgari', 'Van Cleef', 'Harry Winston'],
      furniture: ['Ikea', 'Roche Bobois', 'Minotti', 'B&B Italia', 'Poltrona Frau'],
      appliances: ['Samsung', 'LG', 'Bosch', 'Siemens', 'Whirlpool', 'Electrolux']
    };

    // ألوان
    const colors = ['أسود', 'أبيض', 'فضي', 'ذهبي', 'أزرق', 'أحمر', 'أخضر', 'رمادي'];

    // تعريف وظيفة للحصول على صور عشوائية من مجموعة
    const getRandomImage = (categoryType) => {
      const images = productImages[categoryType];
      return images[Math.floor(Math.random() * images.length)];
    };

    // إنشاء منتجات إلكترونيات (30 منتج)
    for (let i = 1; i <= 30; i++) {
      const brand = brands.electronics[Math.floor(Math.random() * brands.electronics.length)];
      productsData.push({
        name: `${brand} ${['iPhone', 'Galaxy', 'Xperia', 'VivoBook', 'ThinkPad'][i % 5]} ${i + 13}`,
        description: [`أحدث إصدار من ${brand}`, 'تقنية متطورة', 'أداء عالي'],
        properties: [
          { key: 'الماركة', value: brand },
          { key: 'اللون', value: colors[Math.floor(Math.random() * colors.length)] },
          { key: 'السعة', value: `${[128, 256, 512, 1000][i % 4]} GB` },
          { key: 'ذاكرة RAM', value: `${[8, 12, 16, 32][i % 4]} GB` }
        ],
        category: categories[0]._id,
        subcategory: ['هواتف ذكية', 'لابتوبات', 'ساعات ذكية', 'أجهزة لوحية', 'سماعات'][i % 5],
        store: stores[0]._id,
        brand: brand,
        pricePurchase: [299, 399, 499, 599, 699, 799, 899, 999][i % 8] * (i % 3 + 1),
        priceRental: [29, 39, 49, 59, 69, 79][i % 6],
        images: [getRandomImage('electronics')],
        stockQuantity: Math.floor(Math.random() * 50) + 10,
        isBestSeller: i % 10 === 0,
        createdAt: new Date()
      });
    }

    // أزياء رجالية (25 منتج)
    for (let i = 1; i <= 25; i++) {
      const brand = brands.fashionMen[Math.floor(Math.random() * brands.fashionMen.length)];
      productsData.push({
        name: `${brand} ${['بدلة', 'قميص', 'بنطال', 'حذاء', 'جاكيت'][i % 5]} رقم ${i}`,
        description: ['جودة عالية', 'تصميم أنيق', 'مناسب للمناسبات'],
        properties: [
          { key: 'الماركة', value: brand },
          { key: 'اللون', value: colors[Math.floor(Math.random() * colors.length)] },
          { key: 'المقاس', value: ['S', 'M', 'L', 'XL'][i % 4] },
          { key: 'المادة', value: ['قطن', 'صوف', 'حرير', 'جلد'][i % 4] }
        ],
        category: categories[1]._id,
        subcategory: ['بدلات', 'قمصان', 'بناطيل', 'أحذية', 'إكسسوارات'][i % 5],
        store: stores[1]._id,
        brand: brand,
        pricePurchase: [99, 149, 199, 249, 299, 349][i % 6] * (i % 2 + 1),
        priceRental: [9, 14, 19, 24, 29][i % 5],
        images: [getRandomImage('fashionMen')],
        stockQuantity: Math.floor(Math.random() * 100) + 20,
        isBestSeller: i % 8 === 0,
        createdAt: new Date()
      });
    }

    // أزياء نسائية (25 منتج)
    for (let i = 1; i <= 25; i++) {
      const brand = brands.fashionWomen[Math.floor(Math.random() * brands.fashionWomen.length)];
      productsData.push({
        name: `${brand} ${['فساتين', 'تنانير', 'بلوزات', 'أحذية', 'حقائب'][i % 5]} رقم ${i}`,
        description: ['تصميم راقي', 'خامة ممتازة', 'أناقة عالية'],
        properties: [
          { key: 'الماركة', value: brand },
          { key: 'اللون', value: colors[Math.floor(Math.random() * colors.length)] },
          { key: 'المقاس', value: ['XS', 'S', 'M', 'L'][i % 4] },
          { key: 'المادة', value: ['حرير', 'ساتان', 'دانتيل', 'شيفون'][i % 4] }
        ],
        category: categories[2]._id,
        subcategory: ['فساتين', 'تنانير', 'بلوزات', 'أحذية', 'حقائب'][i % 5],
        store: stores[1]._id,
        brand: brand,
        pricePurchase: [129, 179, 229, 279, 329, 379][i % 6] * (i % 2 + 1),
        priceRental: [12, 17, 22, 27, 32][i % 5],
        images: [getRandomImage('fashionWomen')],
        stockQuantity: Math.floor(Math.random() * 100) + 20,
        isBestSeller: i % 8 === 0,
        createdAt: new Date()
      });
    }

    // ساعات يد (30 منتج)
    for (let i = 1; i <= 30; i++) {
      const brand = brands.watches[Math.floor(Math.random() * brands.watches.length)];
      productsData.push({
        name: `${brand} ${['سوبرا', 'ماستر', 'إكسبلورر', 'نوتيلوس', 'رويال أوك'][i % 5]} ${1900 + i}`,
        description: ['ساعة فاخرة', 'تصميم كلاسيكي', 'جودة سويسرية'],
        properties: [
          { key: 'الماركة', value: brand },
          { key: 'نوع الحركة', value: ['أوتوماتيكية', 'كوارتز', 'ميكانيكية'][i % 3] },
          { key: 'المادة', value: ['ذهب', 'فضة', 'ستانلس ستيل', 'تيتانيوم'][i % 4] },
          { key: 'الماء', value: `${[30, 50, 100, 200, 300][i % 5]} متر` }
        ],
        category: categories[3]._id,
        subcategory: ['سويسرية', 'رياضية', 'كلاسيكية', 'ذكية'][i % 4],
        store: stores[2]._id,
        brand: brand,
        pricePurchase: [999, 1499, 1999, 2499, 2999, 4999][i % 6] * (i % 3 + 1),
        priceRental: [99, 149, 199, 249][i % 4],
        images: [getRandomImage('watches')],
        stockQuantity: Math.floor(Math.random() * 20) + 5,
        isBestSeller: i % 15 === 0,
        createdAt: new Date()
      });
    }

    // عطور (25 منتج)
    for (let i = 1; i <= 25; i++) {
      const brand = brands.perfumes[Math.floor(Math.random() * brands.perfumes.length)];
      productsData.push({
        name: `${brand} ${['نوار', 'سوفاج', 'أوبسيشن', 'لا في إست بيل', 'شانيل رقم 5'][i % 5]} ${i}`,
        description: ['عطر مميز', 'ثبات طويل', 'نفحات عطرية'],
        properties: [
          { key: 'الماركة', value: brand },
          { key: 'الحجم', value: `${[50, 75, 100, 150][i % 4]} مل` },
          { key: 'نوع العطر', value: ['بارفيوم', 'أو دو بارفيوم', 'أو دي تواليت'][i % 3] },
          { key: 'النوع', value: ['رجالي', 'نسائي', 'عائلي'][i % 3] }
        ],
        category: categories[4]._id,
        subcategory: ['رجالية', 'نسائية', 'عائلية', 'نادرة'][i % 4],
        store: stores[3]._id,
        brand: brand,
        pricePurchase: [79, 129, 179, 229, 279, 329][i % 6] * (i % 2 + 1),
        priceRental: 0,
        images: [getRandomImage('perfumes')],
        stockQuantity: Math.floor(Math.random() * 200) + 50,
        isBestSeller: i % 10 === 0,
        createdAt: new Date()
      });
    }

    // مجوهرات (25 منتج)
    for (let i = 1; i <= 25; i++) {
      const brand = brands.jewelry[Math.floor(Math.random() * brands.jewelry.length)];
      productsData.push({
        name: `${brand} ${['خاتم', 'قلادة', 'سوار', 'أقراط', 'سلسلة'][i % 5]} ${['ألماس', 'ذهب', 'فضة', 'لؤلؤ'][i % 4]}`,
        description: ['مجوهرات فاخرة', 'تصميم مميز', 'أناقة راقية'],
        properties: [
          { key: 'الماركة', value: brand },
          { key: 'المعدن', value: ['ذهب 18 قيراط', 'ذهب 21 قيراط', 'فضة', 'بلاتين'][i % 4] },
          { key: 'الأحجار', value: ['ألماس', 'ياقوت', 'زمرد', 'لؤلؤ'][i % 4] },
          { key: 'الوزن', value: `${[2, 3, 5, 7, 10][i % 5]} غرام` }
        ],
        category: categories[5]._id,
        subcategory: ['ذهب', 'فضة', 'ألماس', 'ساعات'][i % 4],
        store: stores[4]._id,
        brand: brand,
        pricePurchase: [499, 799, 1299, 1999, 2999, 4999][i % 6] * (i % 3 + 1),
        priceRental: [49, 79, 129, 199][i % 4],
        images: [getRandomImage('jewelry')],
        stockQuantity: Math.floor(Math.random() * 30) + 5,
        isBestSeller: i % 12 === 0,
        createdAt: new Date()
      });
    }

    // أثاث منزلي (25 منتج)
    for (let i = 1; i <= 25; i++) {
      const brand = brands.furniture[Math.floor(Math.random() * brands.furniture.length)];
      productsData.push({
        name: `${brand} ${['كنبة', 'طاولة', 'كرسي', 'خزانة', 'سرير'][i % 5]} ${['مودرن', 'كلاسيكي', 'معاصر', 'ريفي'][i % 4]}`,
        description: ['أثاث فاخر', 'تصميم متميز', 'راحة وجودة'],
        properties: [
          { key: 'الماركة', value: brand },
          { key: 'الخشب', value: ['زان', 'أرز', 'ماهوجني', 'بلوط'][i % 4] },
          { key: 'اللون', value: colors[Math.floor(Math.random() * colors.length)] },
          { key: 'الأبعاد', value: `${[150, 180, 200, 220][i % 4]} × ${[80, 90, 100, 120][i % 4]} سم` }
        ],
        category: categories[6]._id,
        subcategory: ['غرف نوم', 'صالات', 'مطابخ', 'ديكورات'][i % 4],
        store: stores[5]._id,
        brand: brand,
        pricePurchase: [299, 499, 799, 1299, 1999][i % 5] * (i % 2 + 1),
        priceRental: [29, 49, 79, 129][i % 4],
        images: [getRandomImage('furniture')],
        stockQuantity: Math.floor(Math.random() * 15) + 3,
        isBestSeller: i % 15 === 0,
        createdAt: new Date()
      });
    }

    // أجهزة كهربائية (25 منتج)
    for (let i = 1; i <= 25; i++) {
      const brand = brands.appliances[Math.floor(Math.random() * brands.appliances.length)];
      productsData.push({
        name: `${brand} ${['تلفزيون', 'ثلاجة', 'غسالة', 'مكيف', 'فرن'][i % 5]} ${['ذكي', 'اقتصادي', 'سريع', 'هادئ'][i % 4]}`,
        description: ['جهاز حديث', 'موفر للطاقة', 'تقنية متطورة'],
        properties: [
          { key: 'الماركة', value: brand },
          { key: 'النوع', value: ['شاشة ذكية', 'ثلاجة مزدوجة', 'غسالة أوتوماتيك', 'مكيف سبليت'][i % 4] },
          { key: 'السعة', value: `${[32, 43, 55, 65][i % 4]} بوصة` },
          { key: 'الاستهلاك', value: ['A++', 'A+', 'A', 'B'][i % 4] }
        ],
        category: categories[7]._id,
        subcategory: ['تلفزيونات', 'ثلاجات', 'غسالات', 'مكيفات'][i % 4],
        store: stores[6]._id,
        brand: brand,
        pricePurchase: [399, 599, 899, 1299, 1799][i % 5] * (i % 2 + 1),
        priceRental: [39, 59, 89, 129][i % 4],
        images: [getRandomImage('appliances')],
        stockQuantity: Math.floor(Math.random() * 25) + 5,
        isBestSeller: i % 10 === 0,
        createdAt: new Date()
      });
    }

    // إضافة منتجات إضافية لبلوغ 210 منتج
    const remainingProducts = 210 - productsData.length;
    const categoryTypes = ['electronics', 'fashionMen', 'fashionWomen', 'watches', 'perfumes', 'jewelry', 'furniture', 'appliances'];
    
    for (let i = 0; i < remainingProducts; i++) {
      const categoryIndex = i % 8;
      const storeIndex = categoryIndex % 8;
      const categoryType = categoryTypes[categoryIndex];
      
      productsData.push({
        name: `منتج إضافي ${i + 1} - ${categories[categoryIndex].name}`,
        description: ['منتج عالي الجودة', 'تصميم مميز', 'من أفضل المنتجات في السوق'],
        properties: [
          { key: 'اللون', value: colors[i % colors.length] },
          { key: 'الحجم', value: ['صغير', 'متوسط', 'كبير'][i % 3] },
          { key: 'المادة', value: ['عالية الجودة', 'متينة', 'فاخرة'][i % 3] }
        ],
        category: categories[categoryIndex]._id,
        subcategory: categories[categoryIndex].subcategories[i % categories[categoryIndex].subcategories.length],
        store: stores[storeIndex]._id,
        brand: 'Furato Elite',
        pricePurchase: 99 * (i % 5 + 1) + 50,
        priceRental: 9 * (i % 3 + 1) + 5,
        images: [getRandomImage(categoryType)],
        stockQuantity: Math.floor(Math.random() * 100) + 10,
        isBestSeller: i % 20 === 0,
        createdAt: new Date()
      });
    }

    // حفظ المنتجات في قاعدة البيانات
    await Product.insertMany(productsData);
    console.log(`✅ تم إنشاء ${productsData.length} منتج مع صور حقيقية`);

    console.log('\n🎉 تم الانتهاء من تعبئة البيانات بنجاح!');
    console.log('📊 الإحصائيات:');
    console.log(`   - 8 فئات رئيسية`);
    console.log(`   - 8 متاجر`);
    console.log(`   - ${productsData.length} منتج`);
    console.log(`   - 8 مستخدمين`);
    console.log(`   - جميع المنتجات تحتوي على صور Unsplash حقيقية`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ في تعبئة البيانات:', error);
    process.exit(1);
  }
};

seedData();