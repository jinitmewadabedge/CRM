const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Role = require("./models/Role");
const authRoutes = require("./routes/authRoutes");
const testRoute = require("./routes/test");
const leadRoute = require("./routes/leadRoutes");
const roleRoutes = require("./routes/roleRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const trainingRoutes = require("./routes/trainingRoutes");
const cvRoutes = require("./routes/cvRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const User = require("./models/User");
const { importUsers } = require("./controllers/authController");
const responseTime = require("response-time");
const compression = require("compression");
const http = require("http");
const { Server } = require("socket.io");
const { log } = require("console");

dotenv.config();

const app = express();

app.use((req, res, next) => {
    if (req.path === "/api/auth/login" || req.path === "/api/auth/logout") return next();
    compression()(req, res, next);
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
});

global.io = io;

io.on('connection', (socket) => {
    console.log("Socket Connected:", socket.id);

    socket.on('register', async ({ userId, role, token }) => {
        if (role) socket.join(role);
        if (userId) socket.join(userId);
        console.log(`Socket ${socket.id} joined rooms: ${role}, ${userId}`);
    });

    socket.on('disconnect', async () => {
        console.log("Socket Disconnected", socket.id);

    });
});

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
app.use(responseTime((req, res, time) => {
    console.log(`${req.method} ${req.originalUrl} - ${time.toFixed(2)} ms`);
}));

app.use("/api/auth", authRoutes);
app.use("/", testRoute);
app.use("/api/leads", leadRoute);
app.use("/api/roles", roleRoutes);
app.use("/users/import", importUsers);
app.use("/api/candidates", candidateRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/resume", resumeRoutes);
app.get("/", (req, res) => res.send("Server running websocket"));


const uri = process.env.MONGO_URL_PROD;
console.log("MONGO_URI:", uri);

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
});

const db = mongoose.connection;

db.on("error", (err) => console.error("MongoDB connection error:", err));
db.once("open", async () => {

    console.log("Connected to MongoDB Database:", db.name);

    await User.updateMany(
        { activeSessionId: { $ne: null } },
        { $set: { activeSessionId: null } }
    );

    console.log("✅ Cleared stale sessions on startup");

    await Promise.all([
        User.findOne({}, "_id").lean(),
        Role.findOne({}, "_id").lean(),
    ]);
    console.log("MongoDB URI used:", uri);
    console.log("MongoDB");
});

server.listen(PORT, () => {
    console.log(`Server+ Websocket running on port ${PORT}`);
});

setInterval(async () => {
    const timeoutMinutes = 30;
    const cutoff = new Date(Date.now() - timeoutMinutes * 60 * 1000);

    try {
        const result = await User.updateMany({
            activeSessionId: { $ne: null },
            lastActive: { $lt: cutoff }
        },
            {
                $set: { activeSessionId: null }
            });

        if (result.modifiedCount > 0) {
            console.log(`Expired in ${result.modifiedCount} inactve sessions`);
        }
    } catch (error) {
        console.error("Session cleanup error:", err.message);
    }
}, 5 * 60 * 1000);

// setInterval(async () => {
//     const timeoutMinutes = 5;

//     try {
//         const inactiveUsers = await User.updateMany(
//             { isLoggedIn: true, lastActive: { $lt: cutoff } },
//             { $set: { isLoggedIn: false, activeToken: null } }
//         );

//         if (inactiveUsers.modifiedCount > 0) {
//             console.log(`Cleaned up ${inactiveUsers.modifiedCount} inactive users`);
//         }
//     } catch (err) {
//         console.error("Cleanup error:", err.message);
//     }
// }, 2 * 60 * 1000);
