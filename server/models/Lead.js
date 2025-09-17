const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Resume Lead", "Manual Lead"],
        required: true
    },

    candidate_name: {
        type: String,
        required: true
    },
    candidate_phone_no: {
        type: String,
        required: true
    },
    candidate_email: {
        type: String,
        required: true,
        unique: true
    },
    linked_in_url: {
        type: String,
    },
    university: {
        type: String
    },
    technology: [String],
    visa: {
        type: String,
        enum: ["H1B", "F1", "OPT", "L1", "Green Card", "Citizen"]
    },
    preferred_time_to_talk: {
        type: String,
        enum: ["Morning", "Afternoon", "Night"],
        default: "Night"
    },

    source: {
        type: String
    },
    status: {
        type: String,
        enum: ["New", "Connected", "In Progress", "Shortlisted", "Rejected", "Converted"],
        default: "New"
    },
    notes: [
        {
            body: String,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    assignToSales: {
        type: Boolean,
        default: false
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    priority: {
        type: String,
        enum: ["High", "Medium", "Low"],
        default: "Medium"
    }

}, {
    timestamps: true
});

leadSchema.index({ departmentId: 1 });
leadSchema.index({ teamId: 1 });
leadSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Lead', leadSchema);
