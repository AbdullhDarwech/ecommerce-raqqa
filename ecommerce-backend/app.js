const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const storeRoutes = require('./routes/storeRoutes');

const { authenticate, authorizeAdmin } = require('./middleware/auth');
const {
  getProfile,
  updateProfile,
  getFavorites,
  addToFavorites,
  changePassword
} = require('./controllers/userController');

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  getOrders,
  updateOrder,
  getUsers,
  updateUser
} = require('./controllers/adminController');

const { getCategories } = require('./controllers/productController');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// ----------------------
// Routes Authentication
// ----------------------
app.use('/auth', authRoutes);

// ----------------------
// Routes Products
// ----------------------
app.use('/products', productRoutes);

// ----------------------
// Routes Cart & Orders
// ----------------------
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

// ----------------------
// Routes Stores
// ----------------------
app.use("/stores", storeRoutes);

// ----------------------
// Routes Categories
// ----------------------
app.get('/categories', getCategories);

// ----------------------
// Routes Users
// ----------------------
app.get('/users/profile', authenticate, getProfile);
app.put('/users/profile', authenticate, updateProfile);
app.get('/users/favorites', authenticate, getFavorites);
app.post('/users/favorites', authenticate, addToFavorites);
app.put('/users/password', authenticate, changePassword);

// ----------------------
// Admin Routes
// ----------------------
// Products
app.get('/admin/products', authenticate, authorizeAdmin, getProducts);
app.post('/admin/products', authenticate, authorizeAdmin, createProduct);
app.put('/admin/products/:id', authenticate, authorizeAdmin, updateProduct);
app.delete('/admin/products/:id', authenticate, authorizeAdmin, deleteProduct);

// Categories
app.get('/admin/categories', authenticate, authorizeAdmin, getCategories);
app.post('/admin/categories', authenticate, authorizeAdmin, createCategory);
app.put('/admin/categories/:id', authenticate, authorizeAdmin, updateCategory);
app.delete('/admin/categories/:id', authenticate, authorizeAdmin, deleteCategory);

// Orders
app.get('/admin/orders', authenticate, authorizeAdmin, getOrders);
app.put('/admin/orders/:id', authenticate, authorizeAdmin, updateOrder);

// Users
app.get('/admin/users', authenticate, authorizeAdmin, getUsers);
app.put('/admin/users/:id', authenticate, authorizeAdmin, updateUser);

// Stores (Admin management)
app.get('/admin/stores', authenticate, authorizeAdmin, require('./controllers/storeController').getAllStores);
app.post('/admin/stores', authenticate, authorizeAdmin, require('./controllers/storeController').createStore);
app.put('/admin/stores/:id', authenticate, authorizeAdmin, require('./controllers/storeController').updateStore);
app.delete('/admin/stores/:id', authenticate, authorizeAdmin, require('./controllers/storeController').deleteStore);
app.get(
  '/admin/stores/:id', 
  authenticate, 
  authorizeAdmin, 
  require('./controllers/storeController').getStoreById
);

module.exports = app;
