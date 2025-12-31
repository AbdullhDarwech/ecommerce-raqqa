
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/database');

// استيراد الميدل وير الخاص بالرفع
const upload = require('./middleware/upload');

// استيراد المتحكمات
const authController = require('./controllers/authController');
const productController = require('./controllers/productController');
const categoryController = require('./controllers/categoryController');
const orderController = require('./controllers/orderController');
const userController = require('./controllers/userController');
const storeController = require('./controllers/storeController');

// استيراد الميدل وير
const { authenticate, authorizeAdmin } = require('./middleware/auth');

const app = express();

// الاتصال بقاعدة البيانات
connectDB();

// الإعدادات العامة
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// تسجيل الطلبات للتتبع (Debug)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- المسارات العامة (Public Routes) ---
app.get('/categories', categoryController.getAllCategories);
app.get('/products', productController.getAllProducts);
app.get('/products/:id', productController.getProductById);
app.get('/stores', storeController.getAllStores);

// --- مسارات المصادقة (Auth) ---
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

// --- مسارات المستخدم المحمي (User Protected) ---
app.get('/users/profile', authenticate, authController.getProfile);
app.put('/auth/profile', authenticate, authController.updateProfile);
app.post('/orders', authenticate, orderController.createOrder);
app.get('/orders', authenticate, orderController.getAllOrders);

// --- مسارات الإدارة (Admin Routes) ---

// إدارة الفئات
app.get('/admin/categories', authenticate, authorizeAdmin, categoryController.getAllCategories);
app.post('/admin/categories', authenticate, authorizeAdmin, upload.single('image'), categoryController.createCategory);
app.put('/admin/categories/:id', authenticate, authorizeAdmin, upload.single('image'), categoryController.updateCategory);
app.delete('/admin/categories/:id', authenticate, authorizeAdmin, categoryController.deleteCategory);

// إدارة الطلبات
app.get('/admin/orders', authenticate, authorizeAdmin, orderController.getAllOrders);
app.get('/admin/orders/:id', authenticate, authorizeAdmin, orderController.getOrderById);
app.put('/admin/orders/:id', authenticate, authorizeAdmin, orderController.updateOrderStatus);

// إدارة المنتجات (ترتيب مهم جداً)
app.get('/admin/products', authenticate, authorizeAdmin, productController.getAllProducts);
// هذا هو المسار الذي كان يسبب خطأ 404، نضمن هنا وجوده بشكل صريح
app.get('/admin/products/:id', authenticate, authorizeAdmin, productController.getProductById); 
app.post('/admin/products', authenticate, authorizeAdmin, upload.array('images', 5), productController.createProduct);
app.put('/admin/products/:id', authenticate, authorizeAdmin, upload.array('images', 5), productController.updateProduct);
app.delete('/admin/products/:id', authenticate, authorizeAdmin, productController.deleteProduct);

// إدارة المستخدمين
app.get('/admin/users', authenticate, authorizeAdmin, userController.getAllUsers);
app.put('/admin/users/:id', authenticate, authorizeAdmin, userController.updateUserRole);
app.delete('/admin/users/:id', authenticate, authorizeAdmin, userController.deleteUser);

// إدارة المتاجر
app.get('/admin/stores', authenticate, authorizeAdmin, storeController.getAdminStores); 
app.get('/admin/stores/:id', authenticate, authorizeAdmin, storeController.getStoreById); 
app.post('/admin/stores', authenticate, authorizeAdmin, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), storeController.createStore);
app.put('/admin/stores/:id', authenticate, authorizeAdmin, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), storeController.updateStore);
app.delete('/admin/stores/:id', authenticate, authorizeAdmin, storeController.deleteStore);

// معالج الأخطاء العالمي 404 للمسارات غير المعرفة
app.use((req, res, next) => {
  res.status(404).json({ error: `المسار ${req.url} غير موجود في خوادم فوراتو` });
});

// معالج الأخطاء العام
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err);
  res.status(err.status || 500).json({ 
    error: err.message || 'حدث خطأ غير متوقع في السيرفر' 
  });
});

module.exports = app;
