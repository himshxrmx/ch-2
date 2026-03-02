const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    total_students: { type: Number, required: true },
    dominant_emotion: { type: String },
    engaged: { type: Number, required: true },
    not_engaged: { type: Number, required: true },
    engagement_percentage: { type: Number, required: true },
    raw_emotion_counts: { type: Object } // Stored for future dashboard analytics
});

module.exports = mongoose.model('AttendanceRecord', attendanceSchema);