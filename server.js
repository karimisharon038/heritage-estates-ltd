require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize app
const app = express();

// --------------------
// Middleware
// --------------------
app.use(cors({
  origin: "*", // restrict in production to frontend domain
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"]
}));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// --------------------
// Connect MongoDB
// --------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err.message));

// --------------------
// API Routes
// --------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/chat', require('./routes/chat'));

// Optional additional routes
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/staff', require('./routes/staff'));

// --------------------
// Health Check
// --------------------
app.get('/', (req, res) => {
  res.status(200).json({ message: "Heritage Estates Backend Running Successfully" });
});

// --------------------
// Serve Frontend in Production
// --------------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend")));

  // Admin panel
  app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/admin.html"));
  });

  // Main website
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
  });
}

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Heritage Backend running on port ${PORT}`));
