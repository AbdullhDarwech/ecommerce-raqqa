const express = require('express');
const { getCart, addToCart, updateCart, removeFromCart } = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, getCart);
router.post('/add', authenticate, addToCart);
router.put('/update', authenticate, updateCart);
router.delete('/remove', authenticate, removeFromCart);

module.exports = router;