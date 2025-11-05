const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const testRoute = require("./routes/test");
const leadRoute = require("./routes/leadRoutes");
const roleRoutes = require("./routes/roleRoutes");
const candidateRoutes = require("./routes/CandidateRoutes");
const trainingRoutes = require("./routes/trainingRoutes");
const cvRoutes = require("./routes/cvRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const User = require("./models/User");
const { importUsers } = require("./controllers/authController");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    "http://localhost:5173",
    "https://bedge-crm.onrender.com",
    "https://bedge-crm.onrender.com/api/auth/login"
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json({
    limit: "10mb",
    type: ["application/json", "text/plain"]
}));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/", testRoute);
app.use("/api/leads", leadRoute);
app.use("/api/roles", roleRoutes);
app.use("/users/import", importUsers);
app.use("/api/candidates", candidateRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/resume", resumeRoutes);

app.get("/api/ping", (req, res) => {
    res.json({ message: "Pong! CORS is working" });
});

const uri = process.env.MONGO_URL_DEV;
console.log("MONGO_URI:", uri);

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => console.error("MongoDB connection error:", err));
db.once("open", () => {
    console.log("Connected to MongoDB Database:", db.name);
    console.log("MongoDB URI used:", uri);
    console.log("MongoDB");
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

setInterval(async () => {
    const timeoutMinutes = 5;
    const cutoff = new Date(Date.now() - timeoutMinutes * 60 * 1000);

    try {
        const inactiveUsers = await User.updateMany(
            { isLoggedIn: true, lastActive: { $lt: cutoff } },
            { $set: { isLoggedIn: false, activeToken: null } }
        );

        if (inactiveUsers.modifiedCount > 0) {
            console.log(`Cleaned up ${inactiveUsers.modifiedCount} inactive users`);
        }
    } catch (err) {
        console.error("Cleanup error:", err.message);
    }
}, 1 * 60 * 1000);
