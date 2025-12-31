
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'اسم المتجر مطلوب'],
    trim: true,
    unique: true
  },
  description: {
    type: [String],
    default: []
  },
  address: {
    type: String,
    required: [true, 'عنوان المتجر مطلوب']
  },
  phone: {
    type: String,
    required: [true, 'رقم هاتف المتجر مطلوب']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  logo: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    whatsapp: { type: String, default: '' }
  },
  workingHours: {
    type: String,
    default: '9:00 AM - 10:00 PM'
  },
  rating: {
    type: Number,
    default: 5,
    min: 0,
    max: 5
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// إضافة علاقة افتراضية لجلب المنتجات المرتبطة بالمتجر
storeSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'store'
});

module.exports = mongoose.model('Store', storeSchema);