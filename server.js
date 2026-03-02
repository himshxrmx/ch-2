require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();

app.use(cors()); 
// Increase limit to 10mb to handle base64 image strings
app.use(express.json({ limit: '10mb' })); 

app.use('/api/attendance', attendanceRoutes);

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000 // Fails after 5 seconds instead of hanging
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => {
    console.error('❌ MongoDB connection error details:');
    console.error(err.reason || err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});