const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String },
  phone: { type: String },
  addresses: [{ type: Object }], // مصفوفة عناوين
  paymentMethods: [{ type: Object }], // إعدادات الدفع
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // إضافة المفضلات
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);