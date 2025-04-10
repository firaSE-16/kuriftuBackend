// models/Feedback.js
import { Schema, model } from 'mongoose';

const feedbackSchema = new Schema({
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  guest: {
    type: Schema.Types.ObjectId,
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

export default model('Feedback', feedbackSchema);
