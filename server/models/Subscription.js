const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: {
    name: { type: String, enum: ['basic', 'standard', 'premium'], required: true },
    price: { type: Number, required: true },
    billingCycle: { type: String, enum: ['monthly', 'quarterly', 'annual'], default: 'monthly' },
    services: [{
      category: String,
      frequency: Number, // times per month
      description: String
    }]
  },
  status: { type: String, enum: ['active', 'paused', 'cancelled', 'expired'], default: 'active' },
  startDate: { type: Date, default: Date.now },
  nextBillingDate: { type: Date },
  nextServiceDate: { type: Date },
  razorpaySubscriptionId: { type: String },
  autoRenew: { type: Boolean, default: true },
  pausedAt: { type: Date },
  cancelledAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
