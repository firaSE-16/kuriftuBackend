const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Common authentication fields
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email']
  },
  password: {
    type: String,
    select: false
  },
  role: {
    type: String,
    required: true,
    enum: ['guest', 'employee', 'admin'],
    default: 'guest'
  },

  // Common personal info
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },

  // Timestamps
  lastLogin: Date,
  accountCreated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true,
  discriminatorKey: 'userType' 
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
