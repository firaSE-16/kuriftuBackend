import mongoose from 'mongoose';
import User from './User.model.js'; // ✅ Import the base model

const employeeSchema = new mongoose.Schema({
  
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  workingHours: {
    type: String,
    
  },
  accountNumber: [String],
  
  assignedFeedbacks: [{
    feedback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback'
    }
  }]
});

// ✅ Create Employee discriminator based on User model
const Employee = User.discriminator('Employee', employeeSchema);

export default Employee;
