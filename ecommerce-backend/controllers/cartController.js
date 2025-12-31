const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cart' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, orderType } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });
    cart.items.push({ product: productId, quantity, orderType });
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error adding to cart' });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate({ user: req.user.id }, req.body, { new: true });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error updating cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    cart.items = cart.items.filter(item => item.product.toString() !== req.body.productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error removing from cart' });
  }
};