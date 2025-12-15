const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },              // اسم المتجر
  description: [{ type: String }],                     // وصف المتجر متعدد الأسطر
  // owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // صاحب المتجر
  logo: { type: String },                              // شعار المتجر
  coverImage: { type: String },                        // صورة غلاف
  categories: [{ type: String }],                      // فئات المتجر
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // منتجات المتجر
   address: { type: String },                            // العنوان
  phone: { type: String },                              // رقم الهاتف
  email: { type: String },                              // البريد الإلكتروني
  isActive: { type: Boolean, default: true },          // لتفعيل أو تعطيل المتجر
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);