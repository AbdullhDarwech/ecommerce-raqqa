const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
 
  description: { type: String },
  imageUrl: { type: String },  // رابط الصورة من Cloudinary
  localInventoryNotes: { type: String },
  subcategories: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
