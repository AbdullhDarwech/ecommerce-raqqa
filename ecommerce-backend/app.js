
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet'); // حماية الـ Headers
const rateLimit = require('express-rate-limit'); // منع الهجمات المتكررة
const mongoSanitize = require('express-mongo-sanitize'); // منع حقن NoSQL
const xss = require('xss-clean'); // تنظيف البيانات من أكواد XSS
require('dotenv').config();
const connectDB = require('./config/database');

const upload = require('./middleware/upload');
const shieldMiddleware = require('./middleware/shield');
const authController = require('./controllers/authController');
const productController = require('./controllers/productController');
const categoryController = require('./controllers/categoryController');
const orderController = require('./controllers/orderController');
const userController = require('./controllers/userController');
const storeController = require('./controllers/storeController');
const { authenticate, authorizeAdmin } = require('./middleware/auth');

const app = express();

// 1. الاتصال بقاعدة البيانات
connectDB();

// 2. إعدادات الأمان المتقدمة (الحصن الرقمي)
app.use(helmet()); // إعداد رؤوس HTTP آمنة
app.use(xss()); // منع حقن أكواد JavaScript في المدخلات
app.use(mongoSanitize()); // منع هجمات $gt: "" في MongoDB

// 3. تحديد معدل الطلبات (Rate Limiting) لمنع الـ Spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // بحد أقصى 100 طلب من كل عنوان IP
  message: { error: 'لقد تجاوزت حد الطلبات المسموح به، يرجى المحاولة لاحقاً.' }
});
app.use('/auth/', limiter); // تطبيق التحديد بشكل صارم على مسارات الدخول والتسجيل

// 4. إعدادات CORS الصارمة
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // اسمح فقط لموقعك بالوصول
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10kb' })); // تحديد حجم الطلب لمنع هجمات التحميل الزائد
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. تفعيل بروتوكول Shield للتمويه
app.use(shieldMiddleware);

// --- المسارات ---
app.get('/categories', categoryController.getAllCategories);
app.get('/products', productController.getAllProducts);
app.get('/products/:id', productController.getProductById);
app.get('/stores', storeController.getAllStores);

app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

app.get('/users/profile', authenticate, authController.getProfile);
app.put('/auth/profile', authenticate, authController.updateProfile);
app.post('/orders', authenticate, orderController.createOrder);
app.get('/orders', authenticate, orderController.getAllOrders);

// مسارات الإدارة (Admin)
app.get('/admin/products/:id', authenticate, authorizeAdmin, productController.getProductById);
app.get('/admin/products', authenticate, authorizeAdmin, productController.getAllProducts);
app.post('/admin/products', authenticate, authorizeAdmin, upload.array('images', 5), productController.createProduct);
app.put('/admin/products/:id', authenticate, authorizeAdmin, upload.array('images', 5), productController.updateProduct);
app.delete('/admin/products/:id', authenticate, authorizeAdmin, productController.deleteProduct);

app.get('/admin/categories', authenticate, authorizeAdmin, categoryController.getAllCategories);
app.post('/admin/categories', authenticate, authorizeAdmin, upload.single('image'), categoryController.createCategory);
app.put('/admin/categories/:id', authenticate, authorizeAdmin, upload.single('image'), categoryController.updateCategory);
app.delete('/admin/categories/:id', authenticate, authorizeAdmin, categoryController.deleteCategory);

app.get('/admin/orders/:id', authenticate, authorizeAdmin, orderController.getOrderById);
app.get('/admin/orders', authenticate, authorizeAdmin, orderController.getAllOrders);
app.put('/admin/orders/:id', authenticate, authorizeAdmin, orderController.updateOrderStatus);

app.get('/admin/users', authenticate, authorizeAdmin, userController.getAllUsers);
app.put('/admin/users/:id', authenticate, authorizeAdmin, userController.updateUserRole);
app.delete('/admin/users/:id', authenticate, authorizeAdmin, userController.deleteUser);

app.get('/admin/stores/:id', authenticate, authorizeAdmin, storeController.getStoreById);
app.get('/admin/stores', authenticate, authorizeAdmin, storeController.getAdminStores); 
app.post('/admin/stores', authenticate, authorizeAdmin, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), storeController.createStore);
app.put('/admin/stores/:id', authenticate, authorizeAdmin, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), storeController.updateStore);
app.delete('/admin/stores/:id', authenticate, authorizeAdmin, storeController.deleteStore);

app.use((req, res) => res.status(404).json({ error: 'المسار غير متاح.' }));

app.use((err, req, res, next) => {
  console.error("🔥 INTERNAL SERVER ERROR:", err);
  res.status(500).json({ error: 'حدث خطأ تقني في السيرفر.' });
});

module.exports = app;
