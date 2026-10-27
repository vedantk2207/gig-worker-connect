const express = require('express');
const Review = require('../models/Review');
const User = require('../models/User');
const Service = require('../models/Service');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @POST /api/reviews
router.post('/', protect, async (req, res) => {
  try {
    const { bookingId, revieweeId, serviceId, rating, comment } = req.body;
    const review = await Review.create({
      booking: bookingId, reviewer: req.user._id, reviewee: revieweeId,
      service: serviceId, rating, comment
    });

    // Update reviewee average rating
    const reviews = await Review.find({ reviewee: revieweeId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await User.findByIdAndUpdate(revieweeId, { averageRating: avg.toFixed(1), totalReviews: reviews.length });
    if (serviceId) {
      const serviceReviews = await Review.find({ service: serviceId });
      const sAvg = serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length;
      await Service.findByIdAndUpdate(serviceId, { averageRating: sAvg.toFixed(1) });
    }

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/reviews/provider/:id
router.get('/provider/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.id })
      .populate('reviewer', 'name avatar').sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
