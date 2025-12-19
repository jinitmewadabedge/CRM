const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    amount: { type: Number, default: 0 },
    date: { type: Date, default: null }
});

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    leadId: { type: mongoose.Schema.ObjectId, ref: "Lead", required: true },

    enrollmentDate: { type: Date, default: Date.now },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    status: { type: String, enum: ["touched", "in-progress", "completed","Recruiter"], default: "touched" },
    plan: { type: String },
    upfront: { type: Number },

    contracted: { type: Number },
    percentage: { type: Number },
    paymentGateway: { type: String },
    salesPerson: { type: mongoose.Schema.ObjectId, ref: "User", default: null },
    TL: { type: mongoose.Schema.ObjectId, ref: "User", default: null },
    manager: { type: mongoose.Schema.ObjectId, ref: "User", default: null },
    enrollmentForm: { type: String },
    jobGuarantee: { type: Boolean, default: false },
    movedToCV: { type: Boolean, default: false },
    movedToTraining: { type: Boolean, default: false },
    movedToMarketing: { type: Boolean, default: false },
    revertToResume: { type: Boolean, default: false },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    technology: { type: [String] },
    paymentType: { type: String },
    reference: { type: String },
    revertReason: { type: String, default: null },
    revertedAt: { type: Date, default: null },
    recruiterStarted: { type: Boolean, default: false },
    reportHistory: [{
        noOfApplications: Number,
        assessmentTechnical: Number,
        screening: Number,
        interview: Number,
        completed: Number,
        status: String,
        reason: String,
        createdAt: { type: Date, default: Date.now}
    }],
    responseReportHistory: [{
        clientName: String,
        email: String,
        contactNo: String,
        scheduledDate: Date,
        scheduledTime: String,
        responseType: String,
        responseMode: String,
        support: Boolean,
        supportPersonName: String,
        interviewStatus: String,
        recruiterRemarks : String,
        finalStatus: String,
        seniorRemarks: String
    }],

    touchedByResume: { type: Boolean, default: false },
    notes: { type: String, default: "" },
    lastCallDate: { type: String },
    lastCallOutcome: { type: String },
    callHistory: [
        {
            outcome: {
                type: String,
                enum: ["In Discussion", "Verification", "Final"],
                default: "In Discussion",
                required: true,

            },
            date: { type: Date, default: Date.now, required: true },
            time: { type: String },
            duration: { type: String, required: true },
            notes: { type: String },
            createdAt: { type: Date, default: Date.now }
        }
    ],

    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    collectedPayments: {
        type: [paymentSchema], default: [
            { amount: 0, date: null },
            { amount: 0, date: null },
            { amount: 0, date: null },
        ]
    },
}, { timestamps: true });

module.exports = mongoose.model("Candidate", candidateSchema);
