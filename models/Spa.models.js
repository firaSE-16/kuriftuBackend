import { discriminator } from './Service';
import { Schema } from 'mongoose';

const spaSchema = new Schema({
  treatmentTypes: [{
    name: String,
    description: String,
    duration: Number, // in minutes
    price: Number
  }],
});

export default discriminator('Spa', spaSchema);
