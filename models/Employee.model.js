const User = require('./User');

const employeeSchema = new mongoose.Schema({
  // Employee-specific fields
  employeeId: {
    type: String,
    unique: true,
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },


  workingHours: {
    type: Map,
    of: String
  },
  accountNumber :[String],

  assignedFeedbacks: [{
    feedback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback'
    },
   
   
  }],
  // Override base role with employee-specific roles
});

// Set discriminator
const Employee = User.discriminator('Employee', employeeSchema);
module.exports = Employee;
