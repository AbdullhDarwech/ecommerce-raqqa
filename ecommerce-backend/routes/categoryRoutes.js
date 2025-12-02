const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const upload = require('../lib/cloudinary'); // نفس ملف multer + Cloudinary

// إنشاء فئة جديدة
router.post('/', authenticate, authorizeAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, subcategories, localInventoryNotes } = req.body;

    const newCategory = new Category({
      name,
      description,
      localInventoryNotes,
      subcategories: subcategories ? JSON.parse(subcategories) : [],
      imageUrl: req.file ? req.file.path : null, // Cloudinary URL
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating category' });
  }
});

// تحديث فئة موجودة مع صورة جديدة
router.put('/:id', authenticate, authorizeAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, subcategories, localInventoryNotes } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    category.name = name || category.name;
    category.description = description || category.description;
    category.localInventoryNotes = localInventoryNotes || category.localInventoryNotes;
    category.subcategories = subcategories ? JSON.parse(subcategories) : category.subcategories;
    if (req.file) category.imageUrl = req.file.path; // Cloudinary URL

    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating category' });
  }
});

// جلب جميع الفئات
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

module.exports = router;
