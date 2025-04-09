import express, { json } from 'express';
import { config } from 'dotenv';
import connectDB from './config/db.js';

import cors from 'cors';


config();





const app = express();


app.use(cors());
app.use(json()); 





// app.use(errorHandler);


const PORT = process.env.PORT || 9001;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`)
});
