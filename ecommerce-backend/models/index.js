const mongoose = require('mongoose');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Review = require('./Review');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Cart = require('./Cart');
const Store = require('./Store');
// تعريف العلاقات (اختياري في Mongoose)
module.exports = { User, Category, Product, Review, Order, OrderItem, Cart  ,Store };