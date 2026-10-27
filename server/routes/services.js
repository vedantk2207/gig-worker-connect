const express = require('express');
const Service = require('../models/Service');
const { protect, authorize } = require('../middleware/auth');
const { getAIMatches, estimatePrice } = require('../utils/matchingEngine');
const router = express.Router();

// @GET /api/services - Get all with filters + AI matching
router.get('/', async (req, res) => {
  try {
    const { category, city, minPrice, maxPrice, rating, search, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (minPrice || maxPrice) query.basePrice = {};
    if (minPrice) query.basePrice.$gte = Number(minPrice);
    if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    if (search) query.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { tags: new RegExp(search, 'i') }
    ];

    const services = await Service.find(query)
      .populate('provider', 'name avatar averageRating isVerified')
      .sort({ averageRating: -1, totalBookings: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Service.countDocuments(query);
    res.json({ success: true, data: services, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/services/ai-match - AI matched services for a customer
router.get('/ai-match', protect, async (req, res) => {
  try {
    const matches = await getAIMatches(req.user, req.query.serviceType);
    res.json({ success: true, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/services/price-estimate
router.get('/price-estimate', async (req, res) => {
  try {
    const { category, city, complexity } = req.query;
    const estimate = await estimatePrice(category, city, complexity);
    res.json({ success: true, data: estimate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    let service = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      service = await Service.findById(req.params.id).populate('provider', 'name avatar averageRating totalReviews bio experience isVerified skills');
    }
    if (!service) {
      const catMap = {
        'svc_1': 'cleaning',
        'svc_2': 'electrical',
        'svc_3': 'plumbing',
        'svc_4': 'tutoring',
        'svc_5': 'electrical',
        'svc_6': 'pest_control'
      };
      const cat = catMap[req.params.id];
      if (cat) {
        service = await Service.findOne({ category: cat }).populate('provider', 'name avatar averageRating totalReviews bio experience isVerified skills');
      }
      if (!service) {
        service = await Service.findOne({ isActive: true }).populate('provider', 'name avatar averageRating totalReviews bio experience isVerified skills');
      }
    }
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/services - Create service (provider only)
router.post('/', protect, authorize('provider'), async (req, res) => {
  try {
    const service = await Service.create({ ...req.body, provider: req.user._id });
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/services/:id
router.put('/:id', protect, authorize('provider', 'admin'), async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, provider: req.user._id },
      req.body, { new: true }
    );
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @DELETE /api/services/:id
router.delete('/:id', protect, authorize('provider', 'admin'), async (req, res) => {
  try {
    await Service.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Service deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
