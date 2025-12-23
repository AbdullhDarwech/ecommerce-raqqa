const jwt = require('jsonwebtoken');
exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'لا يوجد تصريح' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = decoded;
    next();
  } catch (e) { res.status(401).json({ error: 'توكن غير صالح' }); }
};
exports.authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ error: 'غير مسموح للمستخدم العادي' });
};