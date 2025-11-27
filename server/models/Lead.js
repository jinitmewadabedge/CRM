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
        enum: ["H1B", "F1","OCI", "Tier 2", "OPT", "L1", "Green Card", "Citizen"]
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
        enum: ["New", "Connected", "In Discussion", "Interested", "Not Interested", "Enrolled", "Plan Selected", "Upfront Paid", "Rejected", "Converted", "Assigned", "Follow-up"],
        default: "New"
    },
    callHistory: [
        {
            outcome: {
                type: String,
                enum: ["Not Interested", "Interested", "In Discussion", "Follow-up"],
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            },
            time: String,
            duration: String,
            notes: String,
            salesPerson: {
                type: mongoose.Schema.ObjectId,
                ref: "User"
            }
        }
    ],
    enrollment: {
        enrolledAt: Date,
        plan: {
            type: String
        },
        upfrontPaid: {
            type: Boolean,
            default: false
        }
    },
    // notes: [
    //     {
    //         body: String,
    //         date: {
    //             type: Date,
    //             default: Date.now
    //         }
    //     }
    // ],
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
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

// =======================
// 🔥 High Performance Indexes
// =======================

// Unique fields
leadSchema.index({ candidate_email: 1 }, { unique: true });
leadSchema.index({ candidate_phone_no: 1 });

// Status based (for filtering)
leadSchema.index({ status: 1 });

// Assignment-based (MOST USED)
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ assignedBy: 1 });
leadSchema.index({ assignToSales: 1 });

// Filtering by owners
leadSchema.index({ owner: 1 });
leadSchema.index({ createdBy: 1 });

// Department / team
leadSchema.index({ departmentId: 1 });
leadSchema.index({ teamId: 1 });

// Compound Index (BEST for sorting + filtering)
leadSchema.index({ assignedTo: 1, createdAt: -1 });

// Technology filter
leadSchema.index({ technology: 1 });

// Priority
leadSchema.index({ priority: 1 });


module.exports = mongoose.model('Lead', leadSchema);
