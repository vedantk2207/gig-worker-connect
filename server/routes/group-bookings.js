const express = require('express');
const GroupBooking = require('../models/GroupBooking');
const { protect, authorize } = require('../middleware/auth');
const crypto = require('crypto');
const router = express.Router();

// @POST /api/group-bookings - Create group booking
router.post('/', protect, authorize('customer', 'society_manager'), async (req, res) => {
  try {
    const { serviceId, societyName, scheduledDate, scheduledTime, basePrice, maxParticipants } = req.body;
    const shareableLink = crypto.randomBytes(8).toString('hex');
    const societyCode = societyName.replace(/\s+/g, '').toUpperCase().slice(0, 6) + Math.floor(Math.random() * 1000);

    const gb = await GroupBooking.create({
      initiator: req.user._id, service: serviceId,
      societyName, societyCode, shareableLink,
      scheduledDate, scheduledTime, basePrice,
      maxParticipants: maxParticipants || 20,
      participants: [{ user: req.user._id, apartment: req.body.apartment }],
      currentCount: 1,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      groupChatRoom: `group_${shareableLink}`
    });

    res.status(201).json({ success: true, data: gb, joinLink: `/group-booking.html?code=${shareableLink}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/group-bookings/:code/join
router.post('/:code/join', protect, async (req, res) => {
  try {
    const gb = await GroupBooking.findOne({ shareableLink: req.params.code, status: 'open' });
    if (!gb) return res.status(404).json({ success: false, message: 'Group booking not found or closed' });
    if (gb.currentCount >= gb.maxParticipants) return res.status(400).json({ success: false, message: 'Group is full' });

    const alreadyJoined = gb.participants.find(p => p.user.toString() === req.user._id.toString());
    if (alreadyJoined) return res.status(400).json({ success: false, message: 'Already joined' });

    gb.participants.push({ user: req.user._id, apartment: req.body.apartment });
    gb.currentCount += 1;

    // Calculate split price with discount
    const discount = Math.min(gb.currentCount * 2, 30); // max 30% discount
    gb.discountedPrice = gb.basePrice * (1 - discount / 100);
    gb.pricePerParticipant = gb.discountedPrice / gb.currentCount;

    await gb.save();
    res.json({ success: true, data: gb });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/group-bookings/:code
router.get('/:code', async (req, res) => {
  try {
    const gb = await GroupBooking.findOne({ shareableLink: req.params.code })
      .populate('initiator', 'name avatar')
      .populate('service', 'title category images basePrice')
      .populate('participants.user', 'name avatar');
    if (!gb) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: gb });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/group-bookings/my/bookings
router.get('/my/bookings', protect, async (req, res) => {
  try {
    const bookings = await GroupBooking.find({
      $or: [{ initiator: req.user._id }, { 'participants.user': req.user._id }]
    }).populate('service', 'title category images').sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
