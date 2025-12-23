
const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: String, trim: true },
  brand: String,
  pricePurchase: { type: Number, required: true },
  priceRental: Number,
  stockQuantity: { type: Number, default: 0 },
  images: [String],
  isBestSeller: { type: Boolean, default: false },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  // تخزين الخصائص ككائن ديناميكي { "اللون": "أحمر", "المقاس": "XL" }
  specifications: {
    type: Map,
    of: String,
    default: {}
  }
}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema);
