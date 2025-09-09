const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const testRoute = require('./routes/authRoutes');
const leadRoute = require('./routes/leadRoutes');
const roleRoutes = require('./routes/roleRoutes');
const { importUsers } = require('./controllers/authController');
const { importLeads } = require('./controllers/leadController');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoute);
app.use('/api/leads', leadRoute);
app.use('/api/roles', roleRoutes);
app.use('/users/import', importUsers);
app.use("/api/roles", roleRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Error in Connecting MongoDB", err));

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));  
