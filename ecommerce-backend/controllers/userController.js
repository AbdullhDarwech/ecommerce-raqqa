const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, req.body);
    res.json({ message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching favorites' });
  }
};

exports.addToFavorites = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { favorites: req.body.productId } });
    res.json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding to favorites' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!await bcrypt.compare(req.body.oldPassword, user.password)) {
      return res.status(400).json({ error: 'Invalid old password' });
    }
    const hashed = await bcrypt.hash(req.body.newPassword, 10);
    await user.updateOne({ password: hashed });
    res.json({ message: 'Password changed' });
  } catch (error) {
    res.status(500).json({ error: 'Error changing password' });
  }
};