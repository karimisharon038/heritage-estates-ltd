require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const connectDB = require('./config/db');
const cloudinary = require('./utils/cloudinary');
const path = require('path');

// Initialize app
const app = express();

// Connect database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// Middleware
app.use(cors({
  origin: "*",   // You can restrict to frontend URL in production
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/staff', require('./routes/staff'));

// Health endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: "Heritage Estates Backend Running Successfully" });
});

// Production static files (for full deployment)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Heritage Backend running on port ${PORT}`));
