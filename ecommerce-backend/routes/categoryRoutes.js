const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const multer = require('multer');

// إعداد multer للتخزين المؤقت قبل إعادة التسمية
const upload = multer({ dest: 'uploads/' });

// المسارات العامة
router.get('/', categoryController.getAllCategories);

// مسارات الإدارة
router.post('/', authenticate, authorizeAdmin, upload.single('image'), categoryController.createCategory);
router.put('/:id', authenticate, authorizeAdmin, upload.single('image'), categoryController.updateCategory);
router.delete('/:id', authenticate, authorizeAdmin, categoryController.deleteCategory);

module.exports = router;