const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: String,
  bio: String,
  photo: {
    url: String,
    public_id: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Staff", StaffSchema);
