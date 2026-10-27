const Service = require('../models/Service');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Pricing data per category per city (base rates in INR)
const BASE_RATES = {
  cleaning: { min: 300, fair: 600, max: 1500 },
  plumbing: { min: 400, fair: 800, max: 2000 },
  electrical: { min: 350, fair: 700, max: 2500 },
  carpentry: { min: 500, fair: 1200, max: 4000 },
  painting: { min: 800, fair: 2000, max: 8000 },
  pest_control: { min: 600, fair: 1200, max: 3000 },
  gardening: { min: 300, fair: 700, max: 2000 },
  babysitting: { min: 400, fair: 800, max: 1500 },
  elder_care: { min: 600, fair: 1200, max: 2500 },
  tutoring: { min: 300, fair: 600, max: 1500 },
  moving: { min: 1000, fair: 2500, max: 8000 },
  event_help: { min: 500, fair: 1000, max: 3000 },
  other: { min: 300, fair: 700, max: 2000 }
};

const CITY_MULTIPLIERS = {
  mumbai: 1.4, delhi: 1.3, bangalore: 1.35, hyderabad: 1.2,
  chennai: 1.2, pune: 1.15, kolkata: 1.1, ahmedabad: 1.0,
  default: 1.0
};

const COMPLEXITY_MULTIPLIERS = { low: 0.8, medium: 1.0, high: 1.4 };

/**
 * AI Price Estimator — returns min/fair/max price range
 */
const estimatePrice = async (category, city, complexity = 'medium') => {
  const base = BASE_RATES[category] || BASE_RATES.other;
  const cityKey = (city || '').toLowerCase();
  const cityMult = CITY_MULTIPLIERS[cityKey] || CITY_MULTIPLIERS.default;
  const complexMult = COMPLEXITY_MULTIPLIERS[complexity] || 1.0;

  // Factor in real booking data from DB
  const avgFromDB = await Booking.aggregate([
    { $lookup: { from: 'services', localField: 'service', foreignField: '_id', as: 'svc' } },
    { $unwind: '$svc' },
    { $match: { 'svc.category': category, status: 'completed' } },
    { $group: { _id: null, avgPrice: { $avg: '$totalAmount' } } }
  ]);

  const dbAvg = avgFromDB[0]?.avgPrice;
  const fairPrice = dbAvg
    ? Math.round((base.fair * cityMult * complexMult * 0.5) + (dbAvg * 0.5))
    : Math.round(base.fair * cityMult * complexMult);

  return {
    min: Math.round(base.min * cityMult * complexMult),
    fair: fairPrice,
    max: Math.round(base.max * cityMult * complexMult),
    currency: 'INR',
    category, city, complexity,
    isFair: (price) => price >= Math.round(base.min * cityMult) && price <= Math.round(base.max * cityMult)
  };
};

/**
 * AI Smart Job Matching — score providers for a customer
 */
const getAIMatches = async (user, serviceType) => {
  const query = { isActive: true };
  if (serviceType) query.category = serviceType;
  if (user.address?.city) query['location.city'] = new RegExp(user.address.city, 'i');

  const services = await Service.find(query)
    .populate('provider', 'name avatar averageRating totalReviews isVerified equityPoints')
    .limit(50);

  // Get user's booking history for personalization
  const pastBookings = await Booking.find({ customer: user._id, status: 'completed' }).populate('service');
  const preferredCategories = pastBookings.map(b => b.service?.category).filter(Boolean);

  const scored = services.map(service => {
    let score = 0;

    // Rating score (0-40 points)
    score += (service.averageRating / 5) * 40;

    // Experience/bookings score (0-20 points)
    score += Math.min(service.totalBookings / 50, 1) * 20;

    // Verification bonus (10 points)
    if (service.provider?.isVerified) score += 10;

    // Category preference from history (15 points)
    if (preferredCategories.includes(service.category)) score += 15;

    // Equity/trust score (0-10 points)
    const equityScore = Math.min((service.provider?.equityPoints || 0) / 1000, 1) * 10;
    score += equityScore;

    // Price competitiveness (0-5 points)
    const baseRate = BASE_RATES[service.category]?.fair || 700;
    if (service.basePrice <= baseRate) score += 5;

    return {
      ...service.toObject(),
      matchScore: Math.round(score),
      matchBreakdown: {
        rating: Math.round((service.averageRating / 5) * 40),
        experience: Math.round(Math.min(service.totalBookings / 50, 1) * 20),
        verified: service.provider?.isVerified ? 10 : 0,
        preference: preferredCategories.includes(service.category) ? 15 : 0,
        equity: Math.round(equityScore),
        price: service.basePrice <= baseRate ? 5 : 0
      }
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
};

module.exports = { estimatePrice, getAIMatches };
