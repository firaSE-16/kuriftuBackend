const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');


dotenv.config();





const app = express();


app.use(cors());
app.use(express.json()); 


app.use('/api/users', userRoutes);


app.use(errorHandler);


const PORT = process.env.PORT || 9001;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`)
});
