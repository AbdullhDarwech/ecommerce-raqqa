const express = require('express');
const { getProducts, getCategories, getProductById, createProduct } = require('../controllers/productController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.post('/', authenticate, authorizeAdmin, createProduct);

module.exports = router;