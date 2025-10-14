const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
        required: true
    },
    progress: {
        type: String,
        enum: ["CV Pending", "Reviewed", "Rejected", "Selected"],
        default: "CV Pending"
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    startDate: {
        type: Date,
        default: Date.now()
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model("CV", cvSchema);