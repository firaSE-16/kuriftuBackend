const User = require('./User');

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
module.exports = Guest;
