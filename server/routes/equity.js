const express = require('express');
const EquityLedger = require('../models/EquityLedger');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// @GET /api/equity/my - Provider equity dashboard
router.get('/my', protect, authorize('provider'), async (req, res) => {
  try {
    const ledger = await EquityLedger.find({ provider: req.user._id })
      .populate('booking', 'totalAmount completedAt')
      .sort({ createdAt: -1 });
    const user = await User.findById(req.user._id).select('equityPoints equityPercentage name');
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalEquity = await User.aggregate([{ $group: { _id: null, total: { $sum: '$equityPoints' } } }]);
    const totalPoints = totalEquity[0]?.total || 1;
    const myPercentage = ((user.equityPoints / totalPoints) * 100).toFixed(4);

    res.json({
      success: true,
      data: {
        myPoints: user.equityPoints,
        myPercentage,
        totalProviders,
        ledger,
        leaderboard: await User.find({ role: 'provider' }).select('name avatar equityPoints').sort({ equityPoints: -1 }).limit(10)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/equity/leaderboard - Public leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaders = await User.find({ role: 'provider' })
      .select('name avatar equityPoints averageRating totalReviews')
      .sort({ equityPoints: -1 }).limit(10);
    res.json({ success: true, data: leaders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
