const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Roles = ['Admin', 'Sales', 'Marketing', 'Technical', 'Lead_Gen_Manager', 'Sr_Lead_Generator', 'Lead_Gen_Team_Lead', 'Lead_Generator', 'Sales_Manager', 'Resume'];

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    plainPassword: {
        type: String,
        required: true,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    // isLoggedIn: {
    //     type: Boolean,
    //     default: false
    // },
    activeSessionId: {
        type: String,
        default: true
    },
    activeToken: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {

    if (!this.isModified('plainPassword')) return next();
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ isLoggedIn: 1 });
userSchema.index({ lastActive: 1 });
userSchema.index({ departmentId: 1 });
userSchema.index({ teamId: 1 });

module.exports = mongoose.model('User', userSchema);