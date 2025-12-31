
const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');

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
      .populate('category', 'name')
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
    const { id } = req.params;

    // التحقق من صحة المعرف أولاً
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'المعرف المرسل غير صالح' });
    }

    const product = await Product.findById(id).populate('category store');
    if (!product) {
      return res.status(404).json({ error: 'المنتج غير موجود في أرشيف فوراتو، ربما تم حذفه مسبقاً' });
    }
    res.json(product);
  } catch (error) {
    console.error("Fetch Product Error:", error);
    res.status(500).json({ error: 'حدث خطأ تقني أثناء جلب بيانات المقتنى' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const imageUrls = req.files ? req.files.map(file => file.path) : [];
    const productData = { ...req.body };
    
    if (typeof productData.description === 'string') {
      productData.description = [productData.description];
    }
    
    if (productData.properties) {
      try { productData.properties = JSON.parse(productData.properties); } catch(e) {}
    }
    
    productData.isBestSeller = productData.isBestSeller === 'true';
    productData.pricePurchase = Number(productData.pricePurchase);
    productData.priceRental = Number(productData.priceRental || 0);
    productData.stockQuantity = Number(productData.stockQuantity || 0);

    const product = new Product({
      ...productData,
      images: imageUrls
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'المقتنى غير موجود' });

    const updateData = { ...req.body };
    let images = [...product.images];
    
    if (updateData.deletedImages) {
      try {
        const deletedImages = JSON.parse(updateData.deletedImages);
        images = images.filter(img => !deletedImages.includes(img));
      } catch(e) {}
      delete updateData.deletedImages;
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      images = [...images, ...newImages];
    }
    updateData.images = images;

    if (updateData.properties) {
      try { updateData.properties = JSON.parse(updateData.properties); } catch(e) {}
    }

    if (updateData.description && typeof updateData.description === 'string') {
        updateData.description = [updateData.description];
    }

    if (updateData.isBestSeller !== undefined) {
      updateData.isBestSeller = updateData.isBestSeller === 'true';
    }

    if (updateData.pricePurchase) updateData.pricePurchase = Number(updateData.pricePurchase);
    if (updateData.priceRental) updateData.priceRental = Number(updateData.priceRental);
    if (updateData.stockQuantity) updateData.stockQuantity = Number(updateData.stockQuantity);

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(400).json({ error: 'فشل التحديث النخبوي: ' + error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم إزالة المقتنى من المعرض بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'فشل عملية الحذف' });
  }
};