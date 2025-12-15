const Store = require('../models/Store');

// Helper to normalize inputs to arrays (handles both single string and array)
const normalizeArray = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  return [input];
};

// =============================
// Get All Stores
// =============================
const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// Get Store By ID
// =============================
const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'المتجر غير موجود' });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// Create New Store
// =============================
const createStore = async (req, res) => {
  try {
    const { name, address, phone, email, owner, isActive, description, categories } = req.body;

    // Handle Images: Construct web-accessible path
    const logo = req.files && req.files.logo 
      ? `/uploads/${req.files.logo[0].filename}` 
      : '';
    
    const coverImage = req.files && req.files.coverImage 
      ? `/uploads/${req.files.coverImage[0].filename}` 
      : '';

    const store = new Store({
      name,
      address,
      phone,
      email,
      owner,
      isActive: isActive === 'true', // FormData sends boolean as string 'true'
      description: normalizeArray(description),
      categories: normalizeArray(categories),
      logo,
      coverImage
    });

    await store.save();
    res.status(201).json(store);
  } catch (err) {
    console.error("Create Store Error:", err);
    res.status(400).json({ message: err.message });
  }
};

// =============================
// Update Store
// =============================
const updateStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'المتجر غير موجود' });

    // Update Text Fields if present
    if (req.body.name) store.name = req.body.name;
    if (req.body.address) store.address = req.body.address;
    if (req.body.phone) store.phone = req.body.phone;
    if (req.body.email) store.email = req.body.email;
    
    if (req.body.isActive !== undefined) {
      store.isActive = req.body.isActive === 'true';
    }

    // Update Arrays (Robust handling)
    if (req.body.categories !== undefined) {
      store.categories = normalizeArray(req.body.categories);
    }

    if (req.body.description !== undefined) {
      store.description = normalizeArray(req.body.description);
    }

    // Update Images
    if (req.files?.logo) {
      store.logo = `/uploads/${req.files.logo[0].filename}`;
    }
    if (req.files?.coverImage) {
      store.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
    }

    await store.save();
    res.json(store);
  } catch (err) {
    console.error("Update Store Error:", err);
    res.status(400).json({ message: err.message });
  }
};

// =============================
// Delete Store
// =============================
const deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) return res.status(404).json({ message: 'المتجر غير موجود' });
    res.json({ message: 'تم حذف المتجر بنجاح' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore
};