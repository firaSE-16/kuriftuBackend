const mongoose = require('mongoose');

const feedbackProcessedSchema = new mongoose.Schema({
  // Original Feedback Reference
  originalFeedback: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback',
    required: true
  },

  // AI-Processed Data
  problemStatement: {
    type: String,
    required: true // e.g., "Housekeeping: Repeated complaints about dirty towels"
  },
  problemCategory: {
    type: String,
    enum: [
      'housekeeping', 'food-service', 'staff-behavior',
      'facilities', 'booking', 'amenities', 'other'
    ],
    required: true
  },
  sentimentScore: { // -1 (negative) to 1 (positive)
    type: Number,
    required: true
  },
  keywords: [String], // e.g., ["dirty", "towels", "not replaced"]
  isUrgent: Boolean,

  // Resolution Tracking
  status: {
    type: String,
    enum: ['unprocessed', 'acknowledged', 'in-progress', 'resolved', 'dismissed'],
    default: 'unprocessed'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  resolutionNotes: String,
  actionsTaken: [String], // e.g., ["Staff retraining", "New towel supplier"]

  // Metadata
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  adminUpdates: [{
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    statusChange: String,
    note: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

  // Automated Tracking
  firstOccurrence: Date,
  lastOccurrence: Date,
  recurrenceCount: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

// Indexes for quick querying
feedbackProcessedSchema.index({ problemCategory: 1, status: 1 });
feedbackProcessedSchema.index({ branch: 1, isUrgent: 1 });
feedbackProcessedSchema.index({ keywords: 'text' });

module.exports = mongoose.model('FeedbackProcessed', feedbackProcessedSchema);
