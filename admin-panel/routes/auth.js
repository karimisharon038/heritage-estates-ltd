const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// ================= REGISTER =================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    // Check if admin already exists
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Admin already exists' });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    const admin = new Admin({ name, email, password: hashed });
    await admin.save();

    // Set session
    req.session.adminId = admin._id;

    res.json({ msg: 'Registration successful' });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

// ================= LOGIN =================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ msg: 'Email & password required' });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    if (admin.status === 'suspended') {
      return res.status(403).json({ msg: 'Your account is suspended' });
    }

    // Set session
    req.session.adminId = admin._id;

    res.json({ msg: 'Login successful' });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

// ================= LOGOUT =================
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ msg: "Logout failed" });
    res.clearCookie('connect.sid'); // clear session cookie
    res.json({ msg: "Logged out" });
  });
});


module.exports = router;


