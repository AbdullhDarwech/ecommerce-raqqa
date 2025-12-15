// file: controllers/productController.js
const Product = require('../models/Product');
const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;

// دالة مساعدة لاستخراج public_id من URL Cloudinary
const getPublicIdFromUrl = (url) => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const publicId = filename.split('.')[0];
  return `products/${publicId}`; // افتراض أن المجلد هو 'products'
};

exports.getProducts = async (req, res) => {
  try {
    let { 
      page = 1, 
      limit = 12, 
      category, 
      subcategory, 
      price_min, 
      price_max,
      sort,
      store // Add store filter
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    let query = {};

    if (category) {
      const cat = await Category.findOne({
        $or: [
          { name: category }
        ]
      });
      if (cat) query.category = cat._id;
    }
    
    if (subcategory) query.subcategory = subcategory;
    if (store) query.store = store;

    if (price_min) query.pricePurchase = { $gte: Number(price_min) };
    if (price_max)
      query.pricePurchase = { 
        ...query.pricePurchase, 
        $lte: Number(price_max) 
      };

    let sortOption = {};
    if (sort === "best_selling") sortOption = { isBestSeller: -1 };
    if (sort === "new") sortOption = { createdAt: -1 };
    if (sort === "price_low") sortOption = { pricePurchase: 1 };
    if (sort === "price_high") sortOption = { pricePurchase: -1 };

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category")
      .populate("store")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching products" });
  }
};


exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews').populate('category');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, subcategory, pricePurchase, priceRental, stockQuantity, isBestSeller, discountPercentage, brand, store } = req.body;
    
    // Cloudinary images usually handled via middleware or manual upload
    // If using cloudinary directly in controller (Assuming files available in req.files via multer)
    const images = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          // If using stream upload inside middleware, file.path or file.url might exist
          // If using memory storage, we buffer upload.
          // Assuming req.files has path (from cloudinary storage) or we use the buffer logic from first prompt.
          // Let's assume the upload middleware puts 'path' (secure_url) in file.path if using CloudinaryStorage
          if(file.path) images.push(file.path);
          // Fallback if using memory storage and stream upload was done in previous middleware
        }
    }
    
    // Handle description array
    let descArray = description;
    if (description && !Array.isArray(description)) {
        descArray = [description];
    }

    const product = new Product({
      name,
      description: descArray,
      category,
      subcategory,
      brand,
      store: store || null,
      pricePurchase,
      priceRental,
      images,
      stockQuantity,
      isBestSeller,
      discountPercentage,
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
        name, 
        description, 
        category, 
        subcategory, 
        pricePurchase, 
        priceRental, 
        stockQuantity, 
        isBestSeller, 
        discountPercentage, 
        brand,
        store
    } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // 1. Delete removed images
    const deletedImages = req.body.deletedImages ? JSON.parse(req.body.deletedImages) : [];
    if (deletedImages.length > 0) {
      for (let url of deletedImages) {
        try {
          const publicId = getPublicIdFromUrl(url);
          if (publicId) await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error('Error deleting image:', err.message);
        }
      }
      product.images = product.images.filter(img => !deletedImages.includes(img));
    }
    
    // 2. Add new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path); // Assuming CloudinaryStorage
      product.images.push(...newImages);
    }

    // 3. Update Text Fields
    if (name) product.name = name;
    
    // Fix: Handle Description Array (it might come as string if 1 item, or array)
    if (description) {
        product.description = Array.isArray(description) ? description : [description];
    }

    if (category) product.category = category;
    if (subcategory) product.subcategory = subcategory;
    if (brand) product.brand = brand;
    if (store) product.store = store;
    
    // Handle numbers/booleans explicitly (they can be falsy like 0 or false)
    if (pricePurchase !== undefined) product.pricePurchase = pricePurchase;
    if (priceRental !== undefined) product.priceRental = priceRental;
    if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
    if (isBestSeller !== undefined) product.isBestSeller = isBestSeller;
    if (discountPercentage !== undefined) product.discountPercentage = discountPercentage;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error.message || error);
    res.status(500).json({ error: 'Error updating product' });
  }
};