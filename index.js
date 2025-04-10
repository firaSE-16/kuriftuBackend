import express, { json } from 'express';
import { config } from 'dotenv';
import connectDB from './config/db.js';
import subAdminRoute from './routes/subAdmin.route.js';
import cors from 'cors';
import maindAdminRoutes from './routes/mainAdmin.route.js';
import chefRoutes from './routes/chef.route.js';
config();

const app = express();
app.use(cors());
app.use(json()); 

// app.use(errorHandler);

app.use('/api/mainAdmin', maindAdminRoutes);
app.use('/api/subadmin', subAdminRoute);
app.use('/api/chef', chefRoutes);

const PORT = process.env.PORT || 9001;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`)
});
