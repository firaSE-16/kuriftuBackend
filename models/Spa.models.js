const Service = require('./Service');
const mongoose = require('mongoose');

const spaSchema = new mongoose.Schema({
  treatmentTypes: [{
    name: String,
    description: String,
    duration: Number, // in minutes
    price: Number
  }],
});

module.exports = Service.discriminator('Spa', spaSchema);
