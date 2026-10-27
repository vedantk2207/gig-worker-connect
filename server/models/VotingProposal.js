const mongoose = require('mongoose');

const votingProposalSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['fee_change', 'platform_fee', 'new_feature', 'policy', 'welfare', 'community', 'platform_improvement', 'other'],
    default: 'other'
  },
  status: { type: String, enum: ['pending', 'active', 'passed', 'rejected', 'closed'], default: 'pending' },
  votes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vote: { type: String, enum: ['yes', 'no', 'abstain'] },
    weight: { type: Number, default: 1 },
    votedAt: { type: Date, default: Date.now }
  }],
  yesCount: { type: Number, default: 0 },
  noCount: { type: Number, default: 0 },
  abstainCount: { type: Number, default: 0 },
  totalVotes: { type: Number, default: 0 },
  endsAt: { type: Date, required: true },
  result: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VotingProposal', votingProposalSchema);
