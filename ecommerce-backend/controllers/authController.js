
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // --- نظام التحقق المقالي (Backend Validation Protocol) ---
    
    // 1. التحقق من اكتمال البيانات الأساسية
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'عذراً، لا يمكننا معالجة طلبك بدون إكمال كافة البيانات الأساسية (الاسم، البريد، الهاتف، كلمة المرور).' });
    }

    // 2. التحقق من صحة الاسم (على الأقل اسمين)
    if (name.trim().split(' ').length < 2) {
      return res.status(400).json({ error: 'يرجى إدخال الاسم الكامل (الاسم والكنية) لضمان موثوقية حسابك في النظام.' });
    }

    // 3. التحقق من صيغة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'البريد الإلكتروني الذي أدخلته غير صالح، يرجى التأكد من كتابة البريد بشكل صحيح (example@domain.com).' });
    }

    // 4. التحقق من رقم الهاتف (صيغة سورية: 09xxxxxxxx)
    const phoneRegex = /^09[3-9][0-9]{7}$/;
    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({ error: 'رقم الهاتف يجب أن يكون رقماً سورياً صالحاً يبدأ بـ 09 ويتكون من 10 أرقام.' });
    }

    // 5. التحقق من قوة كلمة المرور
    if (password.length < 8) {
      return res.status(400).json({ error: 'لأمان حسابك، يجب أن تتكون كلمة المرور من 8 محارف على الأقل.' });
    }

    // --- التحقق من التكرار في قاعدة البيانات ---

    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ error: 'هذا البريد الإلكتروني مرتبط بحساب نشط بالفعل، هل نسيت كلمة المرور؟' });
    }

    const phoneExists = await User.findOne({ phone: phone.trim() });
    if (phoneExists) {
      return res.status(400).json({ error: 'رقم الهاتف هذا مسجل مسبقاً، يرجى استخدام رقم آخر أو تسجيل الدخول لحسابك.' });
    }

    // --- إنشاء الحساب بعد اجتياز كافة البروتوكولات ---

    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ 
      name, 
      email: email.toLowerCase(), 
      password: hashedPassword, 
      phone: phone.trim(), 
      role 
    });

    res.status(201).json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone, 
        role: user.role 
      }, 
      token: generateToken(user._id, user.role) 
    });

  } catch (error) {
    console.error('Registration Security Error:', error);
    res.status(500).json({ error: 'حدث عطل تقني غير متوقع أثناء معالجة بياناتك، يرجى المحاولة لاحقاً.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          phone: user.phone, 
          role: user.role 
        }, 
        token: generateToken(user._id, user.role) 
      });
    } else {
      res.status(401).json({ error: 'بيانات الدخول غير متطابقة مع سجلاتنا النخبوية.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'عطل في خوادم المصادقة.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'تعذر استرداد بيانات الملف الشخصي.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'المستخدم غير معرف.' });

    user.name = req.body.name || user.name;
    
    if (req.body.phone && req.body.phone !== user.phone) {
        const phoneExists = await User.findOne({ phone: req.body.phone });
        if (phoneExists) return res.status(400).json({ error: 'رقم الهاتف الجديد مستخدم بالفعل.' });
        user.phone = req.body.phone;
    }
    
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }
    
    await user.save();
    res.json({ message: 'تم تحديث سجلاتك بنجاح.' });
  } catch (error) {
    res.status(500).json({ error: 'خطأ أثناء التحديث.' });
  }
};
