const express = require('express');
const Subscription = require('../models/Subscription');
const { protect } = require('../middleware/auth');
const router = express.Router();

const PRESET_PLANS = [
  {
    id: 'basic',
    name: 'Household Essential',
    price: 1999,
    billingCycle: 'monthly',
    tagline: 'Ideal for busy professionals & small apartments',
    services: [
      { category: 'cleaning', frequency: 2, description: '2x Deep Home Cleaning sessions / month' },
      { category: 'electrical', frequency: 1, description: '1x Minor electrical check & repair / month' }
    ],
    perks: ['10% off add-on services', 'Priority cooperative provider dispatch', 'Zero platform surge pricing']
  },
  {
    id: 'standard',
    name: 'Coop Family Care',
    price: 3999,
    billingCycle: 'monthly',
    popular: true,
    tagline: 'Complete peace of mind for 2-3 BHK homes',
    services: [
      { category: 'cleaning', frequency: 4, description: '4x Complete House Cleaning sessions (Weekly)' },
      { category: 'plumbing', frequency: 1, description: '1x Full plumbing inspection & tap/pipe fix' },
      { category: 'electrical', frequency: 1, description: '1x Electrical checkup & appliance servicing' }
    ],
    perks: ['15% off add-on bookings', 'Dedicated worker-owner team', 'Emergency 60-min response', '1 Free AC filter cleanup']
  },
  {
    id: 'premium',
    name: 'Society Platinum Care',
    price: 6999,
    billingCycle: 'monthly',
    tagline: 'All-inclusive luxury maintenance & elder support',
    services: [
      { category: 'cleaning', frequency: 8, description: '8x Bi-weekly deep cleaning & sanitization' },
      { category: 'pest_control', frequency: 1, description: '1x Herbal pest control treatment' },
      { category: 'gardening', frequency: 2, description: '2x Balcony/terrace plant & garden care' },
      { category: 'elder_care', frequency: 2, description: '2x Assisted wellness checkup visits' }
    ],
    perks: ['25% off all platform services', 'Dedicated account manager', 'Free monthly community voting share', 'Free minor spare parts up to ₹500']
  }
];

// @GET /api/subscriptions/plans
router.get('/plans', (req, res) => {
  res.json({ success: true, data: PRESET_PLANS });
});

// @GET /api/subscriptions/my
router.get('/my', protect, async (req, res) => {
  try {
    const subs = await Subscription.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: subs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/subscriptions
router.post('/', protect, async (req, res) => {
  try {
    const { planName, billingCycle = 'monthly' } = req.body;
    const planInfo = PRESET_PLANS.find(p => p.id === planName || p.name.toLowerCase().includes(planName.toLowerCase())) || PRESET_PLANS[0];

    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const nextServiceDate = new Date();
    nextServiceDate.setDate(nextServiceDate.getDate() + 7);

    const subscription = await Subscription.create({
      customer: req.user._id,
      plan: {
        name: planInfo.id,
        price: planInfo.price,
        billingCycle,
        services: planInfo.services
      },
      nextBillingDate,
      nextServiceDate,
      status: 'active'
    });

    res.status(201).json({ success: true, data: subscription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/subscriptions/:id/pause
router.put('/:id/pause', protect, async (req, res) => {
  try {
    const sub = await Subscription.findOne({ _id: req.params.id, customer: req.user._id });
    if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found' });
    sub.status = 'paused';
    sub.pausedAt = new Date();
    await sub.save();
    res.json({ success: true, message: 'Subscription paused', data: sub });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/subscriptions/:id/resume
router.put('/:id/resume', protect, async (req, res) => {
  try {
    const sub = await Subscription.findOne({ _id: req.params.id, customer: req.user._id });
    if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found' });
    sub.status = 'active';
    sub.pausedAt = null;
    await sub.save();
    res.json({ success: true, message: 'Subscription resumed', data: sub });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/subscriptions/:id/cancel
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const sub = await Subscription.findOne({ _id: req.params.id, customer: req.user._id });
    if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found' });
    sub.status = 'cancelled';
    sub.cancelledAt = new Date();
    await sub.save();
    res.json({ success: true, message: 'Subscription cancelled', data: sub });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
