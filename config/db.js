const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

export default connnectDB =()=>{
    mongoose.connect(process.env.MONGDB_URI).then(()=>{
        console.log('MongoDB connected successfully')
    }).catch((error)=>{
        console.log(`MongoDB connection failed: ${error.message}`)
    })

}