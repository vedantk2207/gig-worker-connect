const mongoose = require('mongoose');

const groupBookingSchema = new mongoose.Schema({
  initiator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },

  societyName: { type: String, required: true },
  societyCode: { type: String, required: true },
  shareableLink: { type: String, unique: true },

  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    apartment: String,
    amountDue: Number,
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    joinedAt: { type: Date, default: Date.now }
  }],

  maxParticipants: { type: Number, default: 20 },
  minParticipants: { type: Number, default: 3 },
  currentCount: { type: Number, default: 1 },

  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String, required: true },

  basePrice: { type: Number, required: true },
  discountedPrice: { type: Number },
  pricePerParticipant: { type: Number },

  status: {
    type: String,
    enum: ['open', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },

  groupChatRoom: { type: String },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GroupBooking', groupBookingSchema);
