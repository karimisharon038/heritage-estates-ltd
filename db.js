const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is missing in .env");
      process.exit(1);
    }

    // Append database name if not included
    const uri = process.env.MONGO_URI.includes("heritageestates")
      ? process.env.MONGO_URI
      : `${process.env.MONGO_URI}/heritageestates`;

    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,  // helps when DB is slow
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("🛑 MongoDB Connection Error:");
    console.error(err.message);

    // Retry every 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Events
mongoose.connection.on("disconnected", () =>
  console.log("⚠️ MongoDB disconnected")
);

mongoose.connection.on("reconnected", () =>
  console.log("🔄 MongoDB reconnected")
);

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err.message);
});

module.exports = connectDB;
