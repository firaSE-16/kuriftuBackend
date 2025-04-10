// models/Reward.js
import { Schema, model } from 'mongoose';

const rewardSchema = new Schema({
  guest: {
    type: Schema.Types.ObjectId,
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
    type: Schema.Types.ObjectId,
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

export default model('Reward', rewardSchema);
