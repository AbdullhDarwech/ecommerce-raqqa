// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.register = async (req, res) => {
//   try {
//     const { email, password, name } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ email, password: hashedPassword, name });
//     await user.save();
//     res.status(201).json({ message: 'User registered' });
//   } catch (error) {
//     res.status(500).json({ error: 'Registration failed' });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
//     res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
//   } catch (error) {
//     res.status(500).json({ error: 'Login failed' });
//   }
// };




















const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT with Role
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'الرجاء إدخال الاسم والبريد الإلكتروني وكلمة المرور' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'البريد الإلكتروني مسجل مسبقاً' });
    }

    // Determine Role: First user ever registered becomes 'admin', others 'user'
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role
    });

    if (user) {
      // Pass role to token generator
      const token = generateToken(user._id, user.role);
      
      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        token: token,
      });
    } else {
      res.status(400).json({ error: 'بيانات المستخدم غير صحيحة' });
    }
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: 'حدث خطأ في الخادم أثناء التسجيل' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Pass role to token generator
      const token = generateToken(user._id, user.role);

      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        token: token,
      });
    } else {
      res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'المستخدم غير موجود' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};