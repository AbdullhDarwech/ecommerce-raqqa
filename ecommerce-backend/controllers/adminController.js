const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const User = require('../models/User');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// إعداد multer
const storage = multer.memoryStorage();
const upload = multer({ storage });
// إدارة المنتجات
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
};

// createProduct مع رفع الصور
exports.createProduct = [
  upload.array('images', 10), // اسم الحقل "images"
  async (req, res) => {
    try {
      const { name, description, category, subcategory, brand, pricePurchase, priceRental, stockQuantity, discountPercentage, isBestSeller } = req.body;

      const images = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const uploaded = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: 'products' }, (err, result) => {
              if (err) reject(err);
              else resolve(result);
            });
            stream.end(file.buffer);
          });
          images.push(uploaded.secure_url);
        }
      }

      const product = new Product({
        name,
        description,
        category,
        subcategory,
        brand,
        pricePurchase,
        priceRental,
        stockQuantity,
        discountPercentage,
        isBestSeller,
        images
      });

      await product.save();
      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating product' });
    }
  }
];

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
};

// إدارة الفئات
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error creating category' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error updating category' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting category' });
  }
};

// إدارة الطلبات
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error updating order' });
  }
};

// إدارة المستخدمين
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
};