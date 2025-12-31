
const Store = require('../models/Store');
const Product = require('../models/Product');

/**
 * @desc    جلب كافة المتاجر النشطة للواجهة العامة
 * @route   GET /stores
 */
exports.getAllStores = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { isActive: true };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const stores = await Store.find(query)
      .select('-owner')
      .sort({ rating: -1, name: 1 });

    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: 'فشل جلب المتاجر' });
  }
};

/**
 * @desc    جلب كافة المتاجر للوحة الإدارة مع إحصائيات المنتجات
 * @route   GET /admin/stores
 */
exports.getAdminStores = async (req, res) => {
  try {
    // استخدام Aggregation لجلب المتاجر مع عدد المنتجات في استعلام واحد سريع
    const stores = await Store.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'store',
          as: 'products_info'
        }
      },
      {
        $project: {
          name: 1,
          logo: 1,
          isActive: 1,
          createdAt: 1,
          phone: 1,
          address: 1,
          productCount: { $size: '$products_info' }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.json(stores);
  } catch (error) {
    console.error("Aggregation error:", error);
    const backupStores = await Store.find().sort({ createdAt: -1 });
    res.json(backupStores);
  }
};

/**
 * @desc    جلب متجر محدد بالتفصيل
 */
exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate('categories', 'name');

    if (!store) return res.status(404).json({ error: 'المتجر غير موجود' });
    
    res.json(store);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب بيانات المتجر' });
  }
};

/**
 * @desc    إنشاء متجر جديد
 */
exports.createStore = async (req, res) => {
  try {
    const { 
      name, address, phone, email, owner, isActive, 
      facebook, instagram, whatsapp, workingHours 
    } = req.body;

    const logo = req.files && req.files['logo'] ? req.files['logo'][0].path : '';
    const coverImage = req.files && req.files['coverImage'] ? req.files['coverImage'][0].path : '';
    
    const store = new Store({
      name,
      address,
      phone,
      email,
      owner,
      workingHours,
      isActive: isActive === 'true',
      socialLinks: { facebook, instagram, whatsapp },
      logo,
      coverImage
    });
    
    await store.save();
    res.status(201).json(store);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'اسم المتجر مسجل مسبقاً' });
    }
    res.status(400).json({ error: error.message });
  }
};

/**
 * @desc    تحديث بيانات متجر
 * تم التحسين لمعالجة مشاكل الـ Timeout وضمان عدم فقدان البيانات
 */
exports.updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    
    // جلب المتجر الحالي للتأكد من وجوده والعمل على بياناته
    const existingStore = await Store.findById(id);
    if (!existingStore) return res.status(404).json({ error: 'المتجر غير موجود' });

    const updateData = { ...req.body };
    
    // معالجة الصور المرفوعة (إذا وجدت)
    if (req.files) {
      if (req.files['logo'] && req.files['logo'][0]) {
        updateData.logo = req.files['logo'][0].path;
      }
      if (req.files['coverImage'] && req.files['coverImage'][0]) {
        updateData.coverImage = req.files['coverImage'][0].path;
      }
    }

    // معالجة حالة النشاط بشكل صحيح (من String إلى Boolean)
    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive === 'true';
    }

    // تحديث روابط التواصل الاجتماعي بشكل آمن (Partial Update)
    if (req.body.facebook || req.body.instagram || req.body.whatsapp) {
      updateData.socialLinks = {
        facebook: req.body.facebook || existingStore.socialLinks.facebook,
        instagram: req.body.instagram || existingStore.socialLinks.instagram,
        whatsapp: req.body.whatsapp || existingStore.socialLinks.whatsapp
      };
    }

    // تنفيذ التحديث مع التحقق من صحة البيانات (Validators)
    const store = await Store.findByIdAndUpdate(
      id, 
      { $set: updateData }, 
      { new: true, runValidators: true }
    );
    
    res.json(store);
  } catch (error) {
    console.error("Update store error:", error);
    res.status(400).json({ 
      error: 'فشل تحديث بيانات المتجر. يرجى التحقق من حجم الصور المرفوعة أو جودة الاتصال.' 
    });
  }
};

/**
 * @desc    حذف متجر
 */
exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) return res.status(404).json({ error: 'المتجر غير موجود' });

    // تعطيل كافة المنتجات المرتبطة بالمتجر المحذوف
    await Product.updateMany({ store: req.params.id }, { isActive: false });

    res.json({ message: 'تم حذف المتجر وتعطيل منتجاته بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'فشل عملية الحذف' });
  }
};