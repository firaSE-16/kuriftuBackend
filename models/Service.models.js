const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,

  price : [{
       cost : int,
       ref : "Branch"
}],

  images: [String],
  video : [String],

  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true, discriminatorKey: 'serviceType' });

serviceSchema.index({ name: 'text', description: 'text' });
serviceSchema.index({ branch: 1, isActive: 1 });

module.exports = mongoose.model('Service', serviceSchema);
