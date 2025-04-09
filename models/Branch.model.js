const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    address: String,
    city: String,
    country: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  contact: {
    phone: String,
    email: String
  },
  
  services: [String],
  images: [String],
  video : [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

branchSchema.index({ location: 'text' });

module.exports = mongoose.model('Branch', branchSchema);
