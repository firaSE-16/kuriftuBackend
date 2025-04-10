import { Schema, model, Types } from 'mongoose';

const serviceSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  // Price based on Branch
  price: [{
    cost: {
      type: Number,
      required: true
    },
    branch: {
      type: Types.ObjectId,
      ref: 'Branch',
      required: true
    }
  }],

  // Media
  images: [String],
  video: [String],

  // Rating fields
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },

  // Service status
  isActive: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true,
  discriminatorKey: 'serviceType'
});

// Full-text search on name and description
serviceSchema.index({ name: 'text', description: 'text' });

// Optional: Index on price.branch if you plan to query by branch inside price array
// Not on root-level 'branch' since it's inside price[] now
// serviceSchema.index({ 'price.branch': 1, isActive: 1 });

export default model('Service', serviceSchema);
