const express = require('express');
const VotingProposal = require('../models/VotingProposal');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// @GET /api/voting
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const proposals = await VotingProposal.find(query)
      .populate('author', 'name avatar role')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: proposals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/voting
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, endsAt } = req.body;
    const proposal = await VotingProposal.create({
      author: req.user._id, title, description, category,
      endsAt: endsAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: req.user.role === 'admin' ? 'active' : 'pending'
    });
    res.status(201).json({ success: true, data: proposal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/voting/:id/vote
router.post('/:id/vote', protect, async (req, res) => {
  try {
    const { vote } = req.body;
    const proposal = await VotingProposal.findById(req.params.id);
    if (!proposal || proposal.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Proposal not active' });
    }
    const alreadyVoted = proposal.votes.find(v => v.user.toString() === req.user._id.toString());
    if (alreadyVoted) return res.status(400).json({ success: false, message: 'Already voted' });

    // Equity-weighted voting for providers
    const weight = req.user.role === 'provider' ? Math.max(1, Math.floor(req.user.equityPoints / 100)) : 1;
    proposal.votes.push({ user: req.user._id, vote, weight });
    proposal[`${vote}Count`] += weight;
    proposal.totalVotes += weight;
    await proposal.save();
    res.json({ success: true, message: 'Vote cast', data: proposal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/voting/:id/approve (admin only)
router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const proposal = await VotingProposal.findByIdAndUpdate(
      req.params.id, { status: 'active' }, { new: true }
    );
    res.json({ success: true, data: proposal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
