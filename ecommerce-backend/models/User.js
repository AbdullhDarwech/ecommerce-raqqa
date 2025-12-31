
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'الاسم مطلوب'] 
  },
  email: { 
    type: String, 
    required: [true, 'البريد الإلكتروني مطلوب'], 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: 6
  },
  phone: { 
    type: String, 
    required: [true, 'رقم الهاتف مطلوب'],
    unique: true,
    trim: true
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  favorites: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);