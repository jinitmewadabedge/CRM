const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const testRoute = require('./routes/test');
const leadRoute = require('./routes/leadRoutes');
const roleRoutes = require('./routes/roleRoutes');
const { importUsers } = require('./controllers/authController');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://bedge-crm.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.options("*", cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use('/api/auth', authRoutes);
app.use('/', testRoute);
app.use('/api/leads', leadRoute);
app.use('/api/roles', roleRoutes);
app.use('/users/import', importUsers);
app.get("/api/ping", (req, res) => {
    res.header("Access-Control-Allow-Origin", "https://bedge-crm.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.send({ message: "Pong! CORS is working 🚀" });
});

app.options("/api/ping", (req, res) => {
    res.header("Access-Control-Allow-Origin", "https://bedge-crm.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});


(async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000 // 10s timeout
        });
        console.log("MongoDB connected successfully!");

        // Start server only after DB connected
        app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

    } catch (err) {
        console.error("MongoDB connection error:", err.message);
    }

    // Log connection state every 5s (for debugging)
    setInterval(() => {
        console.log("MongoDB connection state:", mongoose.connection.readyState);
    }, 5000);
})();

// mongoose.connect(process.env.MONGO_URL)
//     .then(() => console.log("MongoDB Connected"))
//     .catch((err) => console.log("Error in Connecting MongoDB", err));

// app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));  
