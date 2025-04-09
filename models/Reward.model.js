// models/Reward.js
const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    enum: ['service_usage', 'feedback'],
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  dateEarned: {
    type: Date,
    default: Date.now
  },
  dateRedeemed: Date,
  status: {
    type: String,
    enum: ['active', 'redeemed', 'expired'],
    default: 'active'
  },
  expiryDate: Date
});

rewardSchema.index({ guest: 1, status: 1 });
rewardSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('Reward', rewardSchema);
