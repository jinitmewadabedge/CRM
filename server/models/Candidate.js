const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    leadId: { type: mongoose.Schema.ObjectId, ref: "Lead", required: true },

    enrollmentDate: { type: Date, default: Date.now },
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

    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Candidate", candidateSchema);
