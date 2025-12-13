// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const seedUsers = async () => {
  const users = [
    { name: 'Amit Kumar', email: 'employee@example.com', password: 'emp123', role: 'employee' },
    { name: 'Neha Sharma', email: 'manager@example.com', password: 'mgr123', role: 'manager' }
  ];

  for (let u of users) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashed });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // FIXED COOKIE SETTINGS FOR PRODUCTION CROSS-ORIGIN
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,                // Required for cross-site cookies in production (HTTPS)
      sameSite: 'none',            // Critical: Allows cookie to be sent from Vercel to Render
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });
  res.json({ success: true, message: 'Logged out successfully' });
};

const getMe = (req, res) => {
  res.json({ user: req.user });
};

module.exports = { login, logout, getMe, seedUsers };