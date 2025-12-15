const Order = require('../models/Order');
const Product = require('../models/Product');
const OrderItem = require('../models/OrderItem');

// إنشاء طلب جديد (تم إصلاح منطق الربط)
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, phone } = req.body;

    // 1. التحقق من أن القائمة ليست فارغة
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'لا توجد منتجات في الطلب' });
    }

    // تهيئة كائن الطلب للحصول على _id مسبقاً
    const order = new Order({
      user: req.user.id,
      deliveryAddress,
      phone,
      status: 'pending',
      items: [], 
      totalPrice: 0 
    });

    let totalPrice = 0;
    const orderItemDocs = []; 

    // 2. مرحلة التحقق والتجهيز
    for (const item of items) {
      if (!item.product) continue;

      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ error: `المنتج غير موجود (ID: ${item.product})` });
      }

      // التحقق من المخزون
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ error: `الكمية غير متوفرة للمنتج: ${product.name}` });
      }

      // تحديد السعر
      const price = item.orderType === 'rental' 
        ? (product.priceRental || product.pricePurchase) 
        : product.pricePurchase;

      totalPrice += price * item.quantity;

      const orderItem = new OrderItem({
        order: order._id, // ربط العنصر بمعرف الطلب
        product: product._id,
        quantity: item.quantity,
        priceAtTime: price,
        orderType: item.orderType || 'purchase'
      });

      orderItemDocs.push({ 
        doc: orderItem, 
        product: product, 
        qty: item.quantity 
      });
    }

    // 3. مرحلة الحفظ
    const orderItemsIds = [];
    
    for (const itemData of orderItemDocs) {
      await itemData.doc.save();
      orderItemsIds.push(itemData.doc._id);

      itemData.product.stockQuantity -= itemData.qty;
      await itemData.product.save();
    }

    // 4. حفظ الطلب النهائي
    order.items = orderItemsIds;
    order.totalPrice = totalPrice;
    
    await order.save();

    res.status(201).json(order);

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ error: error.message || 'حدث خطأ أثناء إنشاء الطلب' });
  }
};

// جلب الطلبات (تم التعديل لتخدم الأدمن والمستخدم العادي)
exports.getAllOrders = async (req, res) => {
  try {
    let query = {};
    
    // إذا لم يكن أدمن، نرجع طلباته فقط
    if (req.user && req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate({
        path: 'items',
        populate: { path: 'product', select: 'name images pricePurchase priceRental' }
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// هذه الدالة يمكن الاحتفاظ بها كمسار بديل أو للأغراض الداخلية
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate({
        path: 'items',
        populate: { path: 'product', select: 'name images' }
      })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    // تجاوز بسيط في حال وصول 'my-orders' بالخطأ إلى هنا
    if (req.params.id === 'my-orders') {
       return exports.getAllOrders(req, res);
    }

    const order = await Order.findById(req.params.id)
      .populate({
        path: 'items',
        populate: { path: 'product' }
      });

    if (!order) return res.status(404).json({ error: 'الطلب غير موجود' });

    // التحقق من الصلاحية
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'غير مصرح لك بعرض هذا الطلب' });
    }

    res.json(order);
  } catch (error) {
    if (error.name === 'CastError') {
       return res.status(400).json({ error: 'رقم الطلب غير صحيح' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'الطلب غير موجود' });

    order.status = req.body.status || order.status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};