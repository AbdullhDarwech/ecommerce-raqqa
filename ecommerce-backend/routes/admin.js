const express = require('express');
const { getProducts, createProduct, updateProduct, deleteProduct, getCategories, createCategory, updateCategory, deleteCategory, getOrders, updateOrder, getUsers, updateUser } = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/products', authenticate, authorizeAdmin, getProducts);
router.post('/products', authenticate, authorizeAdmin, createProduct);
router.put('/products/:id', authenticate, authorizeAdmin, updateProduct);
router.delete('/products/:id', authenticate, authorizeAdmin, deleteProduct);

router.get('/categories', authenticate, authorizeAdmin, getCategories);
router.post('/categories', authenticate, authorizeAdmin, createCategory);
router.put('/categories/:id', authenticate, authorizeAdmin, updateCategory);
router.delete('/categories/:id', authenticate, authorizeAdmin, deleteCategory);

router.get('/orders', authenticate, authorizeAdmin, getOrders);
router.put('/orders/:id', authenticate, authorizeAdmin, updateOrder);

router.get('/users', authenticate, authorizeAdmin, getUsers);
router.put('/users/:id', authenticate, authorizeAdmin, updateUser);

module.exports = router;