
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, phone } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ error: 'السلة فارغة' });

    let totalPrice = 0;
    const orderItems = [];

    // إنشاء الطلب أولاً مع التأكد من حفظ رقم الهاتف المرسل
    const order = new Order({
      user: req.user.id,
      deliveryAddress,
      phone: phone || '', 
      totalPrice: 0
    });

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      const price = item.orderType === 'rental' ? (product.priceRental || product.pricePurchase) : product.pricePurchase;
      
      const newItem = await OrderItem.create({
        order: order._id,
        product: product._id,
        quantity: item.quantity,
        priceAtTime: price,
        orderType: item.orderType || 'purchase'
      });

      orderItems.push(newItem._id);
      totalPrice += price * item.quantity;
    }

    order.items = orderItems;
    order.totalPrice = totalPrice;
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user.id };
    const orders = await Order.find(filter)
      .populate('user', 'name email phone') // تم إضافة phone هنا لجلب رقم الهاتف من حساب المستخدم
      .populate({ path: 'items', populate: { path: 'product', select: 'name images' } })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'فشل جلب الطلبات' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone') // تم إضافة phone هنا أيضاً
      .populate({ path: 'items', populate: { path: 'product' } });
    res.json(order);
  } catch (error) {
    res.status(404).json({ error: 'الطلب غير موجود' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'فشل تحديث الحالة' });
  }
};