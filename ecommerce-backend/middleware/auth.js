
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'يجب تسجيل الدخول للوصول إلى هذا المورد النخبوي.' });
  }

  try {
    // التحقق من التوكن باستخدام المفتاح السري
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fortress_key_2025_elite');
    
    // إضافة بيانات المستخدم للطلب
    req.user = decoded;
    
    // التحقق من صحة التوكن زمنياً (إضافي لضمان عدم انتهاء الصلاحية)
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return res.status(401).json({ error: 'انتهت صلاحية الجلسة الآمنة، يرجى تجديد الدخول.' });
    }

    next();
  } catch (error) {
    console.error("JWT Security Alert:", error.message);
    res.status(401).json({ error: 'محاولة وصول غير مصرح بها أو توكن تالف.' });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // تسجيل محاولات الوصول غير المصرح بها للإدارة (Security Logging)
    console.warn(`⚠️ Security Breach Attempt: User ${req.user ? req.user.id : 'Unknown'} tried to access Admin route.`);
    res.status(403).json({ error: 'هذه الصلاحيات مخصصة حصرياً لإدارة فوراتو.' });
  }
};
