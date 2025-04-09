// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Recipient
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links to Guest/Employee
    required: true
  },

  // Content
  title: {
    type: String,
    required: true // e.g., "Reward Unlocked!"
  },
  message: {
    type: String,
    required: true // "You earned 200 pts for your spa visit!"
  },
  deepLink: String, // "/rewards/123"

  // Metadata  
  type: {
    type: String,
    enum: ['reward', 'booking', 'system', 'promo'],
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  // Expiry & Timing
  expiresAt: Date,
  scheduledSend: Date // For future notifications

}, { timestamps: true });

// Indexes for performance
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);
