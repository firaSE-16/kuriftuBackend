import User from './User.model.js'; 
import { Schema } from 'mongoose';// Import the User model

const employeeSchema = new Schema({
  // Employee-specific fields
  employeeId: {
    type: String,
    unique: true,
    required: true
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },

  workingHours: {
    type: Map,
    of: String
  },

  
  accountNumber: [String],
  assignedFeedbacks: [{
    feedback: {
      type: Schema.Types.ObjectId,
      ref: 'Feedback'
    }
  }],
  
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
    default: 5
  },
  // In Employee.model.js
employeeType: {
    type: String,
    required: true,
    enum: ['chef', 'waiter', 'housekeeping', 'reception', 'manager'],
    default: 'reception'
  },

  status: {
    type: String,
    enum: ['active', 'suspended', 'inactive'],
    default: 'active',
  },
});

// Method to update the employee's status based on the rating
employeeSchema.methods.updateStatus = function () {
  if (this.rating < 3) {
    this.status = 'inactive'; 
  } else {
    this.status = 'active';
  }
};

// Hook to automatically update the status before saving
employeeSchema.pre('save', function (next) {
  this.updateStatus();
  next();
});

// Create and export the Employee model using User.discriminator
const Employee = User.discriminator('Employee', employeeSchema);

export default Employee;