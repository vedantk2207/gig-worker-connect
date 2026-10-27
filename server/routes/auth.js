const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Generate unique referral code
const generateReferralCode = (name) => {
  const base = name.replace(/\s+/g, '').toUpperCase().slice(0, 5);
  return base + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// @POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, referralCode, societyName, language } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });

    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) referredBy = referrer._id;
    }

    const user = await User.create({
      name, email, phone, password, role: role || 'customer',
      referredBy, societyName, language: language || 'en',
      referralCode: generateReferralCode(name)
    });

    // Credit referrer wallet
    if (referredBy) {
      await User.findByIdAndUpdate(referredBy, { $inc: { walletBalance: 50 } });
    }

    const token = signToken(user._id);
    res.status(201).json({
      success: true, token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, language: user.language }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = signToken(user._id);
    res.json({
      success: true, token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, language: user.language, walletBalance: user.walletBalance }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @PUT /api/auth/language
router.put('/language', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { language: req.body.language });
    res.json({ success: true, message: 'Language updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
