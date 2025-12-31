const express = require('express');
const { getProfile, updateProfile, getFavorites, addToFavorites, changePassword } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/favorites', authenticate, getFavorites);
router.post('/favorites', authenticate, addToFavorites);
router.put('/password', authenticate, changePassword);

module.exports = router;