const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalPrice: { type: Number },
  phone: { type: Number },
  status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
  orderType: { type: String, enum: ['purchase', 'rental'], default: 'purchase' },
  deliveryAddress: { type: Object },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }], // ربط بالعناصر
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);