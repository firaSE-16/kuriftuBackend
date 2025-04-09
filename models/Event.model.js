// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Core Info
  title: {
    type: String,
    required: true // "Summer Splash Discount"
  },
  description: String,
  bannerImage: String,

  // Offer Details
  discount: {
    type: Number,
    min: 0,
    max: 100
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service' // Spa, Restaurant, etc.
  }],
  // Timing
  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },

  // Audience Control
  branches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  }],
  guestTiers: [{
    type: String,
    enum: ['silver', 'gold', 'platinum']
  }],

  // Analytics
  views: {
    type: Number,
    default: 0
  },
  redemptions: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

// Indexes
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ isActive: 1 });

module.exports = mongoose.model('Event', eventSchema);
