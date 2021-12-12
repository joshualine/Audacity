const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./configs/mongodb.config');

// Importing routes
const userRoutes = require('./routes/user.routes')  //user routes



dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.json());

// Usiordersng routes
app.use('/api/users', userRoutes);



const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`app is runnig in ${process.env.NODE_ENV} mode on port ${PORT}`))