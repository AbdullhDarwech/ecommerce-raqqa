const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getProducts = async (req, res) => {
  try {
    const { category, subcategory, price_min, price_max, brand, sort } = req.query;
    let query = {};
    if (category) {
      const cat = await Category.findOne({ name: category });
      if (cat) query.category = cat._id;
    }
    if (subcategory) query.subcategory = subcategory;
    if (price_min) query.pricePurchase = { $gte: price_min };
    if (price_max) query.pricePurchase = { ...query.pricePurchase, $lte: price_max };
    if (brand) query.brand = brand;
    let sortOption = {};
    if (sort === 'best_selling') sortOption = { isBestSeller: -1 };

    const products = await Product.find(query).populate('category').sort(sortOption);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
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
    const product = await Product.findById(req.params.id).populate('reviews');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' });
  }
};