const express = require('express');
const { getUserOrders } = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, getUserOrders);
// router.post('/', authenticate, createOrder);

module.exports = router;