const AttendanceRecord = require('../models/AttendanceRecord');
const { analyzeClassroomImage } = require('../services/geminiService');

exports.processAttendance = async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ error: "No image provided." });

        // 1. Get exact counts from Gemini
        const aiData = await analyzeClassroomImage(image);
        
        // 2. Calculate Engagement (Happy + Neutral + Surprised = Engaged)
        const engaged = aiData.happy + aiData.neutral + aiData.surprised;
        const not_engaged = aiData.bored + aiData.sad + aiData.angry;
        
        const engagement_percentage = aiData.total_students > 0 
            ? ((engaged / aiData.total_students) * 100).toFixed(2) 
            : 0;

        // 3. Save to DB
        const newRecord = new AttendanceRecord({
            total_students: aiData.total_students,
            engaged,
            not_engaged,
            engagement_percentage,
            raw_emotion_counts: aiData
        });
        await newRecord.save();

        // 4. Return flat data structure matching your script.js expectations
        res.status(200).json({
            total_students: aiData.total_students,
            happy: aiData.happy,
            neutral: aiData.neutral,
            bored: aiData.bored,
            sad: aiData.sad,
            angry: aiData.angry,
            surprised: aiData.surprised,
            engagement_percentage: engagement_percentage
        });

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: "Failed to process image." });
    }
};

exports.getRecords = async (req, res) => {
    try {
        // Fetch all records for the dashboard chart
        const records = await AttendanceRecord.find().sort({ timestamp: 1 });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch dashboard data." });
    }
};