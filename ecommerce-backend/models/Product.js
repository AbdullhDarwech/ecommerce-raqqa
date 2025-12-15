const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: Number,
  comment: String,
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },

  // ⬅⬅⬅ تم التعديل: الوصف أصبح مصفوفة نصوص
  description: [{ type: String }],

  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: String },
  pricePurchase: { type: Number },
  priceRental: { type: Number },
  images: [{ type: String }],
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  stockQuantity: { type: Number, default: 0 },
  isBestSeller: { type: Boolean, default: false },
  discountPercentage: { type: Number },
  reviews: [reviewSchema],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
