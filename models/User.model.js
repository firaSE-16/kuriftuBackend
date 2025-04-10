import { Schema, model } from 'mongoose';


const userSchema = new Schema({
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
    enum: ['guest', 'waiter', 'admin','subAdmin','resceptionist'],
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

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await compare(candidatePassword, this.password);
};

// Indexes

userSchema.index({ role: 1 });

const User = model('User', userSchema);
export default User;
