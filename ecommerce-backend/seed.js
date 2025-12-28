
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
 * دالة تعبئة البيانات التجريبية لمنصة فوراتو إيليت (المطورة)
 * تركز على الخصائص النوعية لكل فئة والمنتجات الأكثر طلباً في السوق النخبوي.
 */
const seedData = async () => {
  try {
    await connectDB();
    console.log('🔗 تم الاتصال بقاعدة البيانات - بدء بروتوكول التعبئة المطور');

    // 1. تنظيف شامل لقاعدة البيانات
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

    // 2. إنشاء المستخدمين
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      { name: 'مدير النظام التنفيذي', email: 'admin@furato.com', password: hashedPassword, role: 'admin', phone: '0930000001' },
      { name: 'ياسين للتجارة الفاخرة', email: 'yassin@store.com', password: hashedPassword, role: 'user', phone: '0930000002' },
      { name: 'بوتيك لورين', email: 'lauren@store.com', password: hashedPassword, role: 'user', phone: '0930000003' },
    ]);
    console.log('✅ تم إنشاء سجلات المستخدمين');

    // 3. إنشاء الفئات النخبوية (Elite Categories)
    const categories = await Category.insertMany([
      { 
        name: 'إلكترونيات', 
        description: 'تقنيات الغد بين يديك اليوم. من أقوى المعالجات السحابية إلى أنظمة الذكاء الاصطناعي المنزلية، نختار لك قمة ما توصلت إليه التكنولوجيا العالمية لتجربة رقمية لا تضاهى.', 
        imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03', 
        subcategories: ['هواتف ذكية', 'لابتوبات احترافية', 'ساعات ذكية', 'أنظمة صوتية'] 
      },
      { 
        name: 'أزياء وملابس', 
        description: 'تعبير عن الشخصية والنفوذ. مجموعاتنا مختارة من منصات العروض في ميلانو وباريس، صممت خصيصاً لمن يقدرون الجودة الاستثنائية والقصات التي تفرض الحضور.', 
        imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b830c6050', 
        subcategories: ['رسمي', 'كاجوال نخبوي', 'ملابس مناسبات', 'أطقم صيفية'] 
      },
      { 
        name: 'ساعات', 
        description: 'الزمن هو العملة الأغلى، لذا يجب قياسه بدقة متناهية وفخامة تليق بمعصمك. قطع نادرة وإصدارات محدودة تجمع بين الهندسة السويسرية والجمال الخالد.', 
        imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d', 
        subcategories: ['كلاسيكية', 'كرونوغراف', 'ساعات غوص', 'إصدارات محدودة'] 
      },
      { 
        name: 'عطور', 
        description: 'هوية غير مرئية تسبق حضورك. نفحات تسحر الحواس، مستخلصة من أندر المكونات الطبيعية والزيوت العطرية النقية التي تدوم طويلاً لتعكس هيبتك.', 
        imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f', 
        subcategories: ['عطور نيش', 'زيوت عطرية', 'مجموعات هدايا'] 
      }
    ]);
    console.log('✅ تم إنشاء الفئات النخبوية بأوصاف مطورة');

    // 4. إنشاء المتاجر
    const stores = await Store.insertMany([
      {
        name: 'فوراتو تيك - المقر الرئيسي',
        owner: users[1]._id,
        description: ['الوكيل الحصري لأجهزة أبل وسامسونج في الرقة', 'مركز الصيانة المعتمد الوحيد بمعايير عالمية'],
        logo: 'https://images.unsplash.com/photo-1541140134513-85a161dc4a00',
        coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
        categories: [categories[0]._id],
        address: 'الرقة - برج النخبة - الطابق الأول',
        phone: '0930111222',
        email: 'tech@furato.com',
        isActive: true
      },
      {
        name: 'بوتيك فوراتو للمقتنيات النادرة',
        owner: users[2]._id,
        description: ['وجهة الصفوة للساعات والعطور والأزياء', 'خدمة الكونسيرج الشخصي للاقتناء'],
        logo: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5',
        coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
        categories: [categories[1]._id, categories[2]._id, categories[3]._id],
        address: 'الرقة - حي الثكنة - مجمع السلام',
        phone: '0930333444',
        email: 'boutique@furato.com',
        isActive: true
      }
    ]);

    // 5. إنشاء المنتجات مع خصائص تفصيلية
    const productsData = [
      // --- إلكترونيات ---
      {
        name: 'iPhone 15 Pro Max - Elite Titanium',
        description: ['أقوى نظام كاميرا في هاتف ذكي على الإطلاق', 'إطار من التيتانيوم المستخدم في المركبات الفضائية', 'أداء يتجاوز التوقعات مع شريحة A17 Pro'],
        properties: [
          { key: 'المعالج', value: 'A17 Pro chip' },
          { key: 'الذاكرة', value: '256GB / 512GB / 1TB' },
          { key: 'الشاشة', value: '6.7-inch Super Retina XDR' },
          { key: 'المادة', value: 'Titanium Grade 5' }
        ],
        category: categories[0]._id,
        subcategory: 'هواتف ذكية',
        store: stores[0]._id,
        brand: 'Apple',
        pricePurchase: 1199,
        priceRental: 120,
        images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc'],
        stockQuantity: 15,
        isBestSeller: true
      },
      {
        name: 'MacBook Pro M3 Max - 16-inch',
        description: ['وحش الأداء للمحترفين والمبدعين', 'أطول عمر بطارية في لابتوب احترافي يصل لـ 22 ساعة', 'نظام صوتي مكون من 6 مكبرات صوت عالية الأداء'],
        properties: [
          { key: 'المعالج', value: 'M3 Max with 16-core CPU' },
          { key: 'الرام', value: '64GB Unified Memory' },
          { key: 'الشاشة', value: 'Liquid Retina XDR' },
          { key: 'الوزن', value: '2.16 kg' }
        ],
        category: categories[0]._id,
        subcategory: 'لابتوبات احترافية',
        store: stores[0]._id,
        brand: 'Apple',
        pricePurchase: 3499,
        priceRental: 450,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8'],
        stockQuantity: 4,
        isBestSeller: true
      },

      // --- أزياء وملابس ---
      {
        name: 'بذلة سهرة - كوليكشن النخبة الإيطالي',
        description: ['مصنوعة من قماش صوف ميرينو 100%', 'قصة Slim Fit تبرز الهيبة والحضور', 'بطانة حريرية طبيعية لراحة تامة في المناسبات الطويلة'],
        properties: [
          { key: 'المادة', value: '100% Merino Wool' },
          { key: 'المنشأ', value: 'Florence, Italy' },
          { key: 'اللون', value: 'أسود فحمي مطفي' },
          { key: 'نوع القصة', value: 'Italian Tailored Fit' }
        ],
        category: categories[1]._id,
        subcategory: 'رسمي',
        store: stores[1]._id,
        brand: 'Furato Tailoring',
        pricePurchase: 850,
        priceRental: 85,
        images: ['https://images.unsplash.com/photo-1594932224828-b4b05a83296d'],
        stockQuantity: 10,
        isBestSeller: false
      },

      // --- ساعات ---
      {
        name: 'Rolex Submariner Date - 126610LN',
        description: ['المرجع في ساعات الغوص الاحترافية', 'مقاومة للماء حتى 300 متر (1000 قدم)', 'قرص دوار أحادي الاتجاه مع حلقة Cerachrom'],
        properties: [
          { key: 'القطر', value: '41 mm' },
          { key: 'المادة', value: 'Oystersteel' },
          { key: 'المينا', value: 'أسود مع علامات مضيئة' },
          { key: 'الحركة', value: '3235, Manufacture Rolex' }
        ],
        category: categories[2]._id,
        subcategory: 'ساعات غوص',
        store: stores[1]._id,
        brand: 'Rolex',
        pricePurchase: 14500,
        priceRental: 1500,
        images: ['https://images.unsplash.com/photo-1547996160-81dfa63595aa'],
        stockQuantity: 2,
        isBestSeller: true
      },
      {
        name: 'Audemars Piguet Royal Oak',
        description: ['أيقونة التصميم في الساعات الفاخرة', 'سوار متكامل وتصميم ثماني الأضلاع الشهير', 'تشطيب يدوي يتطلب مئات الساعات من العمل'],
        properties: [
          { key: 'القطر', value: '41 mm' },
          { key: 'المادة', value: 'ستانلس ستيل عالي الجودة' },
          { key: 'الحركة', value: 'أوتوماتيكية - كاليبر 4302' },
          { key: 'المينا', value: 'بترولي بنمط Grande Tapisserie' }
        ],
        category: categories[2]._id,
        subcategory: 'إصدارات محدودة',
        store: stores[1]._id,
        brand: 'Audemars Piguet',
        pricePurchase: 48000,
        priceRental: 5000,
        images: ['https://images.unsplash.com/photo-1614164185128-e4ec99c436d7'],
        stockQuantity: 1,
        isBestSeller: false
      },

      // --- عطور ---
      {
        name: 'Creed Aventus - النسخة العاشرة',
        description: ['عطر الملوك والنجاح والقوة', 'افتتاحية من الأناناس والبرغموت مع قاعدة من المسك', 'ثبات هائل وانتشار يسحر الجميع'],
        properties: [
          { key: 'الحجم', value: '100 ml' },
          { key: 'التركيز', value: 'Eau de Parfum' },
          { key: 'النفحات', value: 'فاكهية - خشبية' },
          { key: 'سنة الإصدار', value: '2010 (Celebration Edition)' }
        ],
        category: categories[3]._id,
        subcategory: 'عطور نيش',
        store: stores[1]._id,
        brand: 'Creed',
        pricePurchase: 430,
        priceRental: 0,
        images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f'],
        stockQuantity: 20,
        isBestSeller: true
      },
      {
        name: 'Dior Sauvage Elixir',
        description: ['تركيز عالي جداً يجسد جوهر الرجولة الخام', 'مزيج غير متوقع من الخزامى والتوابل المنعشة', 'زجاجة داكنة اللون تعكس قوة العطر بداخلها'],
        properties: [
          { key: 'الحجم', value: '60 ml' },
          { key: 'التركيز', value: 'Elixir (Parfum High Concentration)' },
          { key: 'النفحات', value: 'شرقية - توابل - خشبية' },
          { key: 'الثبات', value: 'أكثر من 12 ساعة' }
        ],
        category: categories[3]._id,
        subcategory: 'عطور نيش',
        store: stores[1]._id,
        brand: 'Dior',
        pricePurchase: 190,
        priceRental: 0,
        images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539'],
        stockQuantity: 30,
        isBestSeller: false
      }
    ];

    await Product.insertMany(productsData);
    console.log('✅ تم إنشاء المنتجات النخبوية مع كافة الخصائص الفنية');

    console.log('\n🚀 بروتوكول تعبئة فوراتو إيليت المطور اكتمل بنجاح!');
    process.exit(0);
  } catch (error) {
    console.error('❌ عطل في بروتوكول التعبئة:', error);
    process.exit(1);
  }
};

seedData();