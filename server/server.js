const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const testRoute = require("./routes/test");
const leadRoute = require("./routes/leadRoutes");
const roleRoutes = require("./routes/roleRoutes");
const { importUsers } = require("./controllers/authController");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    "http://localhost:5173",
    "https://bedge-crm.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/", testRoute);
app.use("/api/leads", leadRoute);
app.use("/api/roles", roleRoutes);
app.use("/users/import", importUsers);

app.get("/api/ping", (req, res) => {
    res.json({ message: "Pong! CORS is working" });
});

(async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URL_DEV, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000
        });
        console.log("MongoDB connected successfully!");

        app.listen(PORT, () =>
            console.log(`Server running on PORT ${PORT}`)
        );
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
    }

    // setInterval(() => {
    //     console.log("MongoDB connection state:", mongoose.connection.readyState);
    // }, 5000);
})();
