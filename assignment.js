const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  images: [
    {
      url: String,
      public_id: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
