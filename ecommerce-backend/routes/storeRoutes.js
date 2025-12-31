const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore
} = require('../controllers/storeController');

// Routes للجميع
router.get('/', getAllStores);
router.get('/:id', getStoreById);

// Routes للأدمين فقط
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  createStore
);

router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  updateStore
);

router.delete('/:id', authenticate, authorizeAdmin, deleteStore);

module.exports = router;
