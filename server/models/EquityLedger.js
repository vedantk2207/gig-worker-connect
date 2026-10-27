const mongoose = require('mongoose');

const equityLedgerSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  points: { type: Number, required: true },
  type: { type: String, enum: ['earned', 'dividend', 'bonus', 'deducted'], default: 'earned' },
  description: { type: String },
  totalPointsAfter: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EquityLedger', equityLedgerSchema);
