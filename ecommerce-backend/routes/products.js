// file: routes/product.js
const express = require('express');
const { getProducts, getCategories, getProductById, createProduct, updateProduct } = require('../controllers/productController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload'); // استيراد upload للصور
const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.post('/', authenticate, authorizeAdmin, upload.array('images', 10), createProduct); // إضافة upload للإنشاء (مصفوفة صور)
router.put('/:id', authenticate, authorizeAdmin, upload.array('images', 10), updateProduct); // تغيير إلى single للتحديث (صورة واحدة)

module.exports = router;