const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import your MongoDB connection
const customerRoutes = require('./customer/customerRoutes');
const staffRoutes = require('./staff/staffRoutes');
const thoughtsRoutes = require('./thoughts/thoughts')
const bookingRoutes = require('./bookingSystem/booking')
const cors = require('cors'); // Import CORS middleware

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB(); // Call the MongoDB connection

// Initialize express
const app = express();
app.use(express.json());

// Enable CORS for all requests
app.use(cors());

// Use auth routes
app.use('/api/customer', customerRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/thoughts', thoughtsRoutes); // Use thoughts routes
app.use('/api', bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
