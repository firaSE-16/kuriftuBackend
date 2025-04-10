
import mongoose from "mongoose";
import User from './User.model.js';

const guestSchema = new mongoose.Schema({
  // Guest-specific fields



  rewardPoints: {
    type: Number,
    default: 0
  },

  pastExperiences : [String]

});

// Set discriminator
const Guest = User.discriminator('Guest', guestSchema);
export default Guest;
