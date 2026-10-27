const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['cleaning', 'plumbing', 'electrical', 'carpentry', 'painting', 'pest_control',
           'gardening', 'babysitting', 'elder_care', 'tutoring', 'moving', 'event_help', 'other'],
    required: true
  },
  subCategory: { type: String },
  images: [String],
  priceType: { type: String, enum: ['fixed', 'hourly', 'negotiable'], default: 'fixed' },
  basePrice: { type: Number, required: true },
  duration: { type: Number }, // in minutes
  location: {
    city: { type: String, required: true },
    areas: [String],
    pincode: [String]
  },
  tags: [String],
  isActive: { type: Boolean, default: true },
  totalBookings: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  aiMatchScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);
