// models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    
  },
  comment: String,
  
  visitDate: Date,

}, { timestamps: true });

feedbackSchema.index({ service: 1, rating: 1 });
feedbackSchema.index({ guest: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
