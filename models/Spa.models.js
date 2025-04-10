import Service from "./Service.models.js"
import { Schema } from 'mongoose';

const spaSchema = new Schema({
  treatmentTypes: [{
    name: String,
    description: String,
    duration: Number, // in minutes
    price: Number
  }],
});
const Spa=Service.discriminator('Spa', spaSchema);

export default Spa;



