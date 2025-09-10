// routes/test.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Example simple test route
router.get('/', async (req, res) => {
    try {
        // MongoDB connection check
        const dbState = mongoose.connection.readyState;
        // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

        res.json({
            message: "Backend is working!",
            mongoConnectionState: dbState
        });
    } catch (err) {
        console.error("Test route error:", err);
        res.status(500).json({ error: "Backend test failed" });
    }
});

module.exports = router;
