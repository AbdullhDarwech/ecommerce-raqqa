const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  const { deliveryAddress, orderType } = req.body;
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart || !cart.items.length) return res.status(400).json({ error: 'Cart is empty' });

  let totalPrice = 0;
  const orderItems = [];
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    if (!product || product.stockQuantity < item.quantity) return res.status(400).json({ error: 'Insufficient stock' });

    const price = orderType === 'rental' ? product.priceRental : product.pricePurchase;
    totalPrice += price * item.quantity;
    const orderItem = new OrderItem({ product: item.product._id, quantity: item.quantity, priceAtTime: price });
    await orderItem.save();
    orderItems.push(orderItem._id);

    await product.updateOne({ $inc: { stockQuantity: -item.quantity } });
  }

  const order = new Order({ user: req.user.id, totalPrice, orderType, deliveryAddress, items: orderItems });
  await order.save();

  await cart.updateOne({ $set: { items: [] } });
  res.status(201).json(order);
};

exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate('items');
  res.json(orders);
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items');
  if (!order || order.user.toString() !== req.user.id) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
};