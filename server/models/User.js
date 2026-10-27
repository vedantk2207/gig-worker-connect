const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'provider', 'admin', 'society_manager'], default: 'customer' },
  avatar: { type: String, default: '' },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    society: String,
    apartment: String
  },
  language: { type: String, default: 'en' },

  // Provider-specific fields
  skills: [String],
  bio: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  documents: [{ name: String, url: String }],

  // Equity / Co-op shares
  equityPoints: { type: Number, default: 0 },
  equityPercentage: { type: Number, default: 0 },

  // Referral
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  walletBalance: { type: Number, default: 0 },

  // Rating
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },

  // Society Manager
  societyName: { type: String },
  societyCode: { type: String },

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
