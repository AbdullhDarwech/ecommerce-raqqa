
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: [String],
  properties: [{
    key: { type: String, required: true },
    value: { type: String, required: true }
  }],
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  subcategory: { 
    type: String, 
    trim: true 
  },
  brand: {
    type: String,
    trim: true
  },
  pricePurchase: { 
    type: Number, 
    required: true 
  },
  priceRental: {
    type: Number,
    default: 0
  },
  priceOld: {
    type: Number
  },
  discountPercentage: {
    type: Number
  },
  stockQuantity: { 
    type: Number, 
    default: 0 
  },
  images: [String],
  isBestSeller: { 
    type: Boolean, 
    default: false 
  },
  store: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Store' 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Product', productSchema);