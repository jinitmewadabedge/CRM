const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    permissions: {
        lead: {
            createScope: { type: String, enum: ["own", "dept", "team+dept", "all"], default: "own" },
            readScope: { type: String, enum: ["own", "dept", "team+dept", "all"], default: "own" },
            updateScope: { type: String, enum: ["own", "dept", "team+dept", "all"], default: "own" },
            deleteScope: { type: String, enum: ["none", "own", "dept", "team+dept", "all"], default: "none" },
            assignToSales: { type: Boolean, default: false },
            bulkAdd: { type: Boolean, default: false },
            export: { type: Boolean, default: false }
        },
        reports: {
            viewScope: { type: String, enum: ["own", "dept", "team+dept", "all"], default: "own" },
            simpleView: { type: Boolean, default: false },
            manage: { type: Boolean, default: false }
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Role", roleSchema);
