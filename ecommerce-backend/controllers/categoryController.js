
const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'فشل جلب الفئات' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, subcategories, attributeConfig } = req.body;
    
    let parsedSubcategories = [];
    if (subcategories) {
      try { parsedSubcategories = JSON.parse(subcategories); } catch (e) { parsedSubcategories = subcategories.split(',').map(s => s.trim()); }
    }

    let parsedAttributes = [];
    if (attributeConfig) {
      try { parsedAttributes = JSON.parse(attributeConfig); } catch (e) { parsedAttributes = attributeConfig.split(',').map(s => s.trim()); }
    }

    const category = new Category({
      name,
      description,
      imageUrl: req.file ? req.file.path : '',
      subcategories: parsedSubcategories,
      attributeConfig: parsedAttributes
    });
    
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: 'اسم الفئة موجود مسبقاً' });
    res.status(400).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, subcategories, attributeConfig } = req.body;
    
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: 'الفئة غير موجودة' });

    const updateData = {
      name: name || category.name,
      description: description !== undefined ? description : category.description
    };

    if (req.file) updateData.imageUrl = req.file.path;

    if (subcategories) {
      try { updateData.subcategories = JSON.parse(subcategories); } catch (e) { updateData.subcategories = subcategories.split(',').map(s => s.trim()); }
    }

    if (attributeConfig) {
      try { updateData.attributeConfig = JSON.parse(attributeConfig); } catch (e) { updateData.attributeConfig = attributeConfig.split(',').map(s => s.trim()); }
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ error: 'فشل تحديث بيانات الفئة' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'الفئة غير موجودة' });
    res.json({ message: 'تم حذف الفئة بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'فشل عملية الحذف' });
  }
};