
const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, category, subcategory, store, sort, minPrice, maxPrice } = req.query;
    const query = {};

    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (store) query.store = store;
    
    if (minPrice || maxPrice) {
      query.pricePurchase = {};
      if (minPrice) query.pricePurchase.$gte = Number(minPrice);
      if (maxPrice) query.pricePurchase.$lte = Number(maxPrice);
    }

    let sortQuery = { createdAt: -1 };
    if (sort === 'price_asc') sortQuery = { pricePurchase: 1 };
    if (sort === 'price_desc') sortQuery = { pricePurchase: -1 };

    const products = await Product.find(query)
      .populate('category', 'name attributeConfig')
      .populate('store', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortQuery);

    const count = await Product.countDocuments(query);

    res.json({
      data: products,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalItems: count
    });
  } catch (error) {
    res.status(500).json({ error: 'فشل في جلب المنتجات' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category store');
    if (!product) return res.status(404).json({ error: 'المنتج غير موجود' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في السيرفر' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const imageUrls = req.files ? req.files.map(file => file.path) : [];
    
    // تحويل المواصفات من نص إلى كائن إذا كانت مرسلة كـ JSON string
    let specifications = {};
    if (req.body.specifications) {
      try {
        specifications = typeof req.body.specifications === 'string' 
          ? JSON.parse(req.body.specifications) 
          : req.body.specifications;
      } catch (e) { specifications = {}; }
    }

    const product = new Product({
      ...req.body,
      specifications,
      images: imageUrls,
      isBestSeller: req.body.isBestSeller === 'true'
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'المنتج غير موجود' });

    const updateData = { ...req.body };
    
    if (req.body.specifications) {
      try {
        updateData.specifications = typeof req.body.specifications === 'string' 
          ? JSON.parse(req.body.specifications) 
          : req.body.specifications;
      } catch (e) { }
    }

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: 'فشل التحديث' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف المنتج بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'فشل الحذف' });
  }
};