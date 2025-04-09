// models/Food.js
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  // Core identifiers
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  code: { // Internal SKU/shortcode
    type: String,
    unique: true,
    required: true
  },

  // Pricing and cost
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },

 

  // Classification
  category: {
    type: String,
    required: true,
    enum: [
      'appetizer', 'main', 'dessert', 
      'beverage', 'alcohol', 'special'
    ]
  },
  cuisineType: {
    type: String,
    enum: [
      'international', 'italian', 'indian', 
      'chinese', 'japanese', 'local'
    ]
  },

  // Dietary information
  dietaryTags: [{
    type: String,
    enum: [
      'vegetarian', 'vegan', 'gluten-free',
      'halal', 'kosher', 'dairy-free',
      'nut-free', 'organic'
    ]
  }],
 

  // Preparation details
  preparationTime: { // in minutes
    type: Number,
    required: true
  },
  isPrepared: { // Cook-to-order vs ready-made
    type: Boolean,
    default: false
  },
  ingredients: [String],

  // Visuals
  images: [String],


  // Availability
  isAvailable: {
    type: Boolean,
    default: true
  },

  availableAt: [{ // Which branches/restaurants serve this
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],

  // Special flags
 
  isSeasonal: Boolean,

  limitedTimeOffer: {
    active: Boolean,
    startDate: Date,
    endDate: Date
  }
}, { timestamps: true });

// Indexes
foodSchema.index({ name: 'text', description: 'text' });
foodSchema.index({ category: 1, cuisineType: 1 });
foodSchema.index({ dietaryTags: 1 });

module.exports = mongoose.model('Food', foodSchema);
