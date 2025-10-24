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
    status:{ type: String, enum: ["touched", "in-progress", "completed"], default: "touched"},
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
    technology: { type: [String] },
    paymentType: { type: String },
    reference: { type: String },

    touchedByResume: { type: Boolean, default: false },
    notes: { type: String, default: "" },
    lastCallDate: { type: Date },
    lastCallOutcome: { type: String },

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
