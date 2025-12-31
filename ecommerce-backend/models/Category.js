
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم الفئة مطلوب'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  subcategories: [{
    type: String,
    trim: true
  }],
  // الخصائص المقترحة لهذه الفئة (مثلاً: ["اللون", "المقاس", "الخامة"])
  attributeConfig: [{
    type: String,
    trim: true
  }]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Category', categorySchema);
