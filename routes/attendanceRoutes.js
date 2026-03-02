const express = require('express');
const { processAttendance, getRecords } = require('../controllers/attendanceController');

const router = express.Router();

// Matches your script.js fetch to /analyze
router.post('/analyze', processAttendance);

// Matches your dashboard.js fetch to /records
router.get('/records', getRecords);

module.exports = router;