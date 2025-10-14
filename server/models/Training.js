const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
    candidateId: { type: mongoose.Schema.ObjectId, ref: "Candidate" },
    startDate: { type: Date, default: Date.now },
    progress: { type: String, default: "Not Started" },
    cvProgress: { type: String, enum: ["CV Pending", "Reviewed", "Rejected", "Selected"], default: "CV Pending" },
    trainer: { type: mongoose.Schema.ObjectId, ref: "User" },
    status: { type: String, enum: ["Active", "Completed"], default: "Active" },

    cvStatus: { type: String, default: "Active" },
    cvStartDate: { type: Date, default: null },
    cvReviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
});

module.exports = mongoose.model('Training', trainingSchema);