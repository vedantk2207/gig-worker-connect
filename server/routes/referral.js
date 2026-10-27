const express = require('express');
const Referral = require('../models/Referral');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @GET /api/referral/my - My referral stats
router.get('/my', protect, async (req, res) => {
  try {
    const referrals = await Referral.find({ referrer: req.user._id })
      .populate('referee', 'name avatar createdAt')
      .sort({ createdAt: -1 });

    const stats = {
      totalReferrals: referrals.length,
      successfulBookings: referrals.filter(r => r.status === 'booked' || r.status === 'rewarded').length,
      totalEarned: referrals.filter(r => r.rewardCredited).reduce((sum, r) => sum + r.rewardAmount, 0),
      walletBalance: req.user.walletBalance
    };

    res.json({ success: true, data: { referrals, stats, referralCode: req.user.referralCode } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/referral/leaderboard - Top referring communities
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Referral.aggregate([
      { $match: { status: { $in: ['booked', 'rewarded'] } } },
      { $group: { _id: '$referrer', count: { $sum: 1 }, earned: { $sum: '$rewardAmount' } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { name: '$user.name', avatar: '$user.avatar', societyName: '$user.societyName', count: 1, earned: 1 } }
    ]);
    res.json({ success: true, data: leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/referral/track/:code - Track referral click
router.post('/track/:code', async (req, res) => {
  try {
    const referrer = await User.findOne({ referralCode: req.params.code });
    if (!referrer) return res.status(404).json({ success: false, message: 'Invalid referral code' });
    await Referral.create({ referrer: referrer._id, referralCode: req.params.code, status: 'clicked' });
    res.json({ success: true, message: 'Tracked' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
