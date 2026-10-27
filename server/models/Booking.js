const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  groupBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupBooking' },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },

  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String, required: true },
  duration: { type: Number },

  address: {
    street: String, city: String, state: String, pincode: String, landmark: String
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed'],
    default: 'pending'
  },

  totalAmount: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  providerEarnings: { type: Number, default: 0 },
  equityPointsAwarded: { type: Number, default: 0 },

  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  paymentId: { type: String },
  razorpayOrderId: { type: String },

  notes: { type: String },
  isEmergency: { type: Boolean, default: false },
  cancellationReason: { type: String },

  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

module.exports = mongoose.model('Booking', bookingSchema);
